# Profile Server Actions Handoff

This pass adds the first authenticated Supabase profile action bridge.

## Added

- Cookie-bound Supabase server client for Next.js server actions and server components.
- Authenticated profile server actions:
  - `readMyProfileBundleAction`
  - `saveMyBaseProfileAction`
  - `saveMyRiderProfileAction`
- `auth_required` helper result code for signed-out server-action responses.

## Safety boundary

These actions use the Supabase user from `auth.getUser()` on the server-side cookie client. They do not accept a caller-supplied user id and do not use the service-role client.

## Non-goals

- No UI form wiring yet.
- No wallet, trip, payment, dispatch, support, or emergency backend behavior.
- No service-role browser exposure.
