/*
# KisanDirect Backend — Core Schema (profiles, orders, order_items, stock, secure checkout)

## Summary
Extends the existing `products` table with seller + stock columns, and adds three new
owner-scoped tables (`profiles`, `orders`, `order_items`) for user data and order history.
Also adds a SECURITY DEFINER `place_order` function that validates prices and stock on the
server side, so the frontend can never trust a client-supplied price or order more than is
in stock.

## 1. Modified table: products
- `seller_id` (uuid, nullable, references auth.users) — the farmer/seller who listed the product.
- `stock_quantity` (integer, NOT NULL, default 0) — units available for purchase.
  - CHECK constraint: stock_quantity >= 0.
- Added index on `category` for faster filter queries.

## 2. New table: profiles
- `id` (uuid, PK, references auth.users ON DELETE CASCADE) — matches the auth user.
- `full_name` (text, not null) — display name.
- `phone` (text, nullable) — optional contact phone.
- `delivery_address` (text, nullable) — optional delivery address.
- `created_at` / `updated_at` (timestamptz).
- RLS enabled. Each authenticated user can SELECT and UPDATE only their own profile row.
  INSERT is handled automatically by the trigger below on signup.

## 3. New table: orders
- `id` (uuid, PK).
- `user_id` (uuid, NOT NULL, DEFAULT auth.uid(), references auth.users) — the customer.
- `status` (text, default 'placed') — order lifecycle.
- `total_amount` (numeric, NOT NULL) — total charged.
- `delivery_fee` (numeric, NOT NULL, default 0).
- `created_at` (timestamptz).
- RLS enabled. Owner-scoped: a customer can SELECT only their own orders.
  INSERT/UPDATE/DELETE are NOT granted to the client — all order creation goes through
  the `place_order` SECURITY DEFINER function (server-side only).

## 4. New table: order_items
- `id` (uuid, PK).
- `order_id` (uuid, references orders ON DELETE CASCADE).
- `product_id` (uuid, references products).
- `product_name` (text) — snapshot at purchase time.
- `quantity` (integer, NOT NULL, CHECK > 0).
- `unit_price` (numeric, NOT NULL) — price snapshot at purchase time.
- RLS enabled. A customer can SELECT order_items for their own orders only.
  No client INSERT/UPDATE/DELETE — rows are created by `place_order`.

## 5. SECURITY DEFINER function: place_order(p_items jsonb, p_delivery_fee numeric)
- Callable by authenticated users only.
- Validates each item: product exists, is in stock, quantity > 0 and <= stock_quantity.
- Validates the unit price against the live product price (rejects tampered prices).
- Computes the total server-side from the DB prices.
- Inserts the order + order_items and decrements stock atomically.
- Returns the new order id and computed total.
- Has a fixed search_path to prevent injection.

## 6. Trigger: create_profile_on_signup
- AFTER INSERT on auth.users — creates a matching `profiles` row so every new user has
  a profile immediately after signup (full_name pulled from raw_user_meta_data).

## Security
- RLS enabled on all new tables.
- Products keep their existing public read policies (anon + authenticated SELECT).
  New UPDATE/DELETE/INSERT policies are NOT added — product management is server-side.
- Orders and order_items are strictly owner-scoped for SELECT; all writes are via the
  SECURITY DEFINER function which runs with elevated privileges, not the client role.
- Profiles are owner-scoped for SELECT and UPDATE.
- The place_order function uses a fixed search_path and SECURITY DEFINER.
*/

-- 1. Extend products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Backfill stock for existing products so they remain purchasable
UPDATE products SET stock_quantity = 50 WHERE stock_quantity = 0;

-- 2. profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text,
  delivery_address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'placed',
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  delivery_fee numeric NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders"
  ON orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 4. order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items"
  ON order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- 5. place_order SECURITY DEFINER function
CREATE OR REPLACE FUNCTION place_order(p_items jsonb, p_delivery_fee numeric DEFAULT 0)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_total numeric := 0;
  v_item jsonb;
  v_product products%ROWTYPE;
  v_qty integer;
  v_price numeric;
  v_line_total numeric;
BEGIN
  -- Require authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to place an order';
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  IF p_delivery_fee IS NULL OR p_delivery_fee < 0 THEN
    RAISE EXCEPTION 'Invalid delivery fee';
  END IF;

  -- Create the order header
  INSERT INTO orders (user_id, status, total_amount, delivery_fee)
  VALUES (auth.uid(), 'placed', 0, p_delivery_fee)
  RETURNING id INTO v_order_id;

  -- Validate each item and build order_items + running total
  FOR v_item IN SELECT jsonb_array_elements(p_items) LOOP
    v_qty := (v_item->>'quantity')::integer;
    v_price := (v_item->>'unit_price')::numeric;

    IF v_qty IS NULL OR v_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity for product %', v_item->>'product_id';
    END IF;

    SELECT * INTO v_product FROM products WHERE id = (v_item->>'product_id')::uuid;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % not found', v_item->>'product_id';
    END IF;

    IF v_product.in_stock = false THEN
      RAISE EXCEPTION '% is currently out of stock', v_product.name;
    END IF;

    IF v_qty > v_product.stock_quantity THEN
      RAISE EXCEPTION 'Only % units of % available (you requested %)',
        v_product.stock_quantity, v_product.name, v_qty;
    END IF;

    -- Reject tampered prices: client price must match DB price
    IF v_price IS NULL OR v_price <> v_product.price THEN
      RAISE EXCEPTION 'Price mismatch for % — please refresh and try again', v_product.name;
    END IF;

    v_line_total := v_product.price * v_qty;
    v_total := v_total + v_line_total;

    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
    VALUES (v_order_id, v_product.id, v_product.name, v_qty, v_product.price);

    -- Decrement stock
    UPDATE products
      SET stock_quantity = stock_quantity - v_qty
      WHERE id = v_product.id;
  END LOOP;

  -- Set the verified total
  UPDATE orders SET total_amount = v_total + p_delivery_fee WHERE id = v_order_id;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'total', v_total + p_delivery_fee,
    'status', 'placed'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION place_order(jsonb, numeric) TO authenticated;

-- 6. Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
