# Supabase Client Boundary

Sprint 0B foundation placeholder.

Planned files:

- client.ts
- server.ts
- middleware.ts
- database.types.ts

Rules:

- Never expose service-role keys to the browser.
- Browser clients use anon credentials only.
- Server clients own privileged operations.
- RLS is assumed required.
- Auth remains disabled until migration wiring is complete.
