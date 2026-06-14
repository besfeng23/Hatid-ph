# Profile Server Client Handoff

This pass adds a small compile-safe Supabase server client entrypoint for future profile server work.

## Added

- `createProfileSupabaseServerClient()` in `src/lib/supabase/server-profile-client.ts`.
- Uses the existing public Supabase client factory.
- Uses the existing public env contract:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Safety boundary

- No service-role key.
- No browser exposure.
- No UI wiring yet.
- No cookie/session mutation yet.
- No wallet, trip, payment, dispatch, support, or emergency backend behavior.
