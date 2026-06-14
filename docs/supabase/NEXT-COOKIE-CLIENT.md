# Next.js Supabase Cookie Client Handoff

This pass replaces the deferred cookie-client placeholder with a Next.js server-side Supabase cookie client.

## Added

- `createSupabaseCookieServerClientFromEnv()` in `src/lib/supabase/next-server-client.ts`.
- Uses `@supabase/ssr` with `next/headers` cookies.
- Reads public Supabase URL and anon key through the existing environment guard.

## Safety boundary

- Uses the public anon key, not the service-role key.
- Intended only for server components, middleware, and server actions.
- Cookie writes are swallowed where Next.js does not allow mutation.

## Non-goals

- No login UI wiring yet.
- No profile form submit wiring yet.
- No wallet, trip, payment, dispatch, support, or emergency backend behavior.
