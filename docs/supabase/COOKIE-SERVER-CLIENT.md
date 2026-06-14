# Server Client Handoff

This pass keeps a compile-safe server-side Supabase client entrypoint for future profile server work.

## Added

- `createSupabaseCookieServerClientFromEnv()` in `src/lib/supabase/next-server-client.ts`.
- Uses the existing public server client factory.
- Uses the existing public env contract:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Safety boundary

- No service-role key.
- No browser exposure.
- No UI wiring yet.
- Cookie read/write wiring is intentionally deferred until middleware or server actions are added.
- No wallet, trip, payment, dispatch, support, or emergency backend behavior.
