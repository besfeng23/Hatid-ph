# Sprint 0B Execution Order

## Status

This is the single execution-order document for the current Hatid Supabase foundation path.

No step below should be skipped unless the linked issue is updated with the reason.

## Golden rule

Do not wire login, signup, profile persistence, wallet, dispatch, payments, payouts, admin authority, or live-money behavior until the required dependency, schema, RLS, helper, environment, and QA gates are complete.

## Required order

### 1. Dependency and lockfile gate

Tracked by:

```text
#12 Sprint 0B: install Supabase dependencies and regenerate lockfile safely
```

Must install with a real CLI/Codex environment:

```bash
npm install @supabase/supabase-js @supabase/ssr
npm ci
npm run typecheck
npm test
npm run build
```

Commit together:

```text
package.json
package-lock.json
```

### 2. Auth/profile schema and RLS migration gate

Tracked by:

```text
#13 Sprint 0B: plan Supabase auth and profile schema
#14 Sprint 0B: convert auth/profile and RLS plans into first migration PR
```

References:

```text
docs/supabase/AUTH-PROFILE-SCHEMA-PLAN.md
docs/supabase/RLS-POLICY-PLAN.md
```

### 3. Server helper gate

Tracked by:

```text
#15 Sprint 0B: implement server-side profile helpers before auth UI wiring
```

Helpers must block client mutation of server-owned fields and elevated roles.

### 4. Environment and secret gate

Tracked by:

```text
#18 Sprint 0B: configure Supabase and Vercel environment variables safely
```

Never commit real secrets. Never expose service-role keys through `NEXT_PUBLIC_*`.

### 5. Auth UI wiring gate

Tracked by:

```text
#16 Sprint 0B: wire login, signup, and profile UI after Supabase helpers are proven
```

This must preserve the existing Hatid UI design and must not introduce live-money, dispatch, payment, payout, admin, or compliance authority.

### 6. Governance and QA gates

Tracked by:

```text
#17 Sprint 0B: enable branch protection and required verification checks
#19 Sprint 0B: complete manual route QA and regression checklist
```

Branch protection and manual route QA must be complete before risky runtime changes merge.

## Validation commands

Every implementation PR must run:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

## Current safe ChatGPT boundary

ChatGPT may continue to prepare docs, issues, plans, and non-runtime scaffolds.

ChatGPT should not fake dependency installation or edit only `package.json` without regenerating `package-lock.json` in a real environment.

## Current Codex/CLI boundary

Codex/CLI must perform the Supabase dependency install and lockfile update because it requires a real package manager run.
