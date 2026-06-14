# Cookie Server Client Handoff

This pass replaces the deferred cookie-client placeholder with a request-bound Next.js Supabase server client.

## Added

- `createSupabaseCookieServerClientFromEnv()` in `src/lib/supabase/next-server-client.ts`.
- Uses `@supabase/ssr` `createServerClient`.
- Reads `next/headers` cookies on the server.
- Uses the existing public env contract:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Safety boundary

- No service-role key.
- No browser exposure.
- No UI wiring yet.
- Cookie writes are intentionally deferred until middleware or server actions are wired.
- No wallet, trip, payment, dispatch, support, or emergency backend behavior.
