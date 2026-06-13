# Profile Auth Bridge Handoff

This pass adds the first compile-safe authenticated Supabase profile bridge.

## Added

- `createProfileAuthContext(client)` in `src/lib/server-helpers/profile-auth-context.ts`.
- `auth_required` helper result code for signed-out profile flows.
- A deferred placeholder for the Next.js cookie client file so the final UI wiring can happen in a smaller follow-up.

## Safety boundary

The auth bridge reads the Supabase user from `client.auth.getUser()` and builds the profile command service for that user context. It does not accept a caller-supplied user id.

## Non-goals

- No UI form wiring yet.
- No active Next.js server action endpoint yet.
- No wallet, trip, payment, dispatch, support, or emergency backend behavior.
- No service-role browser exposure.
