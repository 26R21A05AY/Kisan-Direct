-- Fix function EXECUTE privileges: revoke from PUBLIC
-- Postgres grants EXECUTE on new functions to PUBLIC by default, so the earlier
-- REVOKE FROM anon had no effect (anon inherits PUBLIC).
-- place_order: authenticated + service_role only.
-- handle_new_user: trigger-only, revoked from everyone except service_role.

REVOKE EXECUTE ON FUNCTION public.place_order(jsonb, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order(jsonb, numeric) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
