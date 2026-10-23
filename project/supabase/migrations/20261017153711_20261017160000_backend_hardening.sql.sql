-- Add covering indexes for foreign keys (performance advisor findings)
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items (product_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products (seller_id);

-- Rewrite ownership policies to wrap auth.uid() in a select wrapper
-- so it is evaluated once per statement instead of per row.

DROP POLICY IF EXISTS select_own_profile ON public.profiles;
CREATE POLICY select_own_profile ON public.profiles
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS update_own_profile ON public.profiles;
CREATE POLICY update_own_profile ON public.profiles
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS select_own_orders ON public.orders;
CREATE POLICY select_own_orders ON public.orders
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS select_own_order_items ON public.order_items;
CREATE POLICY select_own_order_items ON public.order_items
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
      AND orders.user_id = (select auth.uid())
  ));
