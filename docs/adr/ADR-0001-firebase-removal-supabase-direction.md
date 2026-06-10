# ADR-0001: Firebase removal and Supabase migration direction

## Status

Accepted

## Context

Hatid previously contained Firebase-facing application code and environment templates. During stabilization, executable Firebase dependencies were removed from the main app path because the repository is moving toward a Supabase-backed architecture.

The current product preview must remain honest: login, signup, profile persistence, and rider profile persistence are temporarily paused or prototype-limited until Supabase auth and profile storage are deliberately introduced.

## Decision

Hatid will migrate away from executable Firebase app dependencies and toward a Supabase foundation.

The migration will be introduced in controlled layers:

1. Environment-driven Supabase configuration.
2. Server-side boundaries for privileged operations.
3. Auth and profile persistence.
4. Domain-separated trip, dispatch, payment, ledger, admin, and compliance modules.
5. RLS-first database tables and policies.

Firebase imports must not be reintroduced into app code without a new ADR.

## Consequences

- Auth screens may exist before auth persistence is live.
- Profile screens may exist before database writes are live.
- UI must state prototype limitations clearly.
- Supabase service-role keys must never enter client bundles.
- Every Supabase table must assume row-level security by default.

## Validation

Every migration PR must run:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Every migration PR must also confirm no Firebase imports are reintroduced.
