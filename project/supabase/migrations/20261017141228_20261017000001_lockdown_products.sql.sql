/*
# Lock down products table — public read, no client writes

## Summary
The existing products table had fully-open anon INSERT/UPDATE/DELETE policies from the
seed phase. Now that we have a real backend with auth and orders, those write policies
must be removed so unauthenticated or authenticated clients cannot modify product data
through the anon key. Only SELECT remains open for public browsing.

## Security
- DROP the old anon_insert/insert/update/delete policies on products.
- Keep anon_select (public can browse products).
- Product management (price, stock, images) happens server-side or by admins — not via
  the anon client. Stock is decremented by the place_order SECURITY DEFINER function.
*/

DROP POLICY IF EXISTS "anon_insert_products" ON products;
DROP POLICY IF EXISTS "anon_update_products" ON products;
DROP POLICY IF EXISTS "anon_delete_products" ON products;
