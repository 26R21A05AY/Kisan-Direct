/*
# Revoke EXECUTE on SECURITY DEFINER functions from non-allowed roles

## Summary
- `handle_new_user()` is a trigger function fired by a database trigger on auth.users.
  It must NEVER be callable via the REST API. Revoke EXECUTE from anon and authenticated.
- `place_order()` is intentionally callable by authenticated users only (it checks
  auth.uid() internally). Revoke EXECUTE from anon so unauthenticated callers cannot
  reach the function body.

## Security
- Closes the two WARN findings from the Supabase security advisor.
*/

REVOKE EXECUTE ON FUNCTION handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION place_order(jsonb, numeric) FROM anon;
