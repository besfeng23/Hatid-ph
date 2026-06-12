# Server Profile Helpers Contract

## Status

Sprint 0B planning contract. Runtime UI remains disconnected.

## Purpose

Define the server-side profile helper surface before login, signup, profile persistence, or onboarding persistence are connected to Supabase behavior.

## Helpers

The first implementation should provide:

- read profile bundle by user id
- update editable profile fields only
- create or update rider profile fields only
- bootstrap a profile after signup only through trusted server-owned flow

## Inputs

All helpers must require a verified user id supplied by server-side auth context.

They must reject empty or malformed user ids before touching storage.

## Editable profile fields

Only these base profile fields may be user-editable in the first helper pass:

- display name
- photo url

## Editable rider profile fields

Only the rider profile fields allowed by the schema plan may be user-editable in the first helper pass.

## Server-owned fields

Helpers must not allow client-provided values to assign elevated roles, account status, timestamps, owner ids, or completion state.

## Storage adapter

The first helper implementation should depend on a small injected storage adapter so the logic can be tested without connecting runtime UI to Supabase.

## Tests

Add tests covering:

- invalid user id rejection
- not found result
- editable field sanitization
- server-owned field rejection
- storage adapter failure handling

## Runtime wiring rule

Do not connect login, signup, profile forms, or onboarding persistence until:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

also pass and the real Supabase-generated database types are committed.

## Related issues

- #15 server-side profile helpers
- #16 auth UI wiring after helpers are proven
