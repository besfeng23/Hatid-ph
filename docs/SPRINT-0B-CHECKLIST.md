# Sprint 0B Architecture Checklist

Sprint 0B is the stabilization and foundation sprint. Its purpose is to protect the working Hatid preview, establish repo guardrails, and prepare the codebase for Supabase, multi-app structure, and production-grade domain boundaries without pretending that live operations are ready.

## Current rule

Do not start real product features until the checklist below is complete or explicitly deferred in a PR.

## Non-negotiable guardrails

- [ ] Do not redesign the canonical Hatid UI without explicit approval.
- [ ] Do not reintroduce Firebase app dependencies.
- [ ] Do not add fake live wallet balances, payment success, payouts, cash-out, or stored-value behavior.
- [ ] Do not make the client authoritative for trips, dispatch, driver availability, payments, KYC, compliance, ledger, or admin permissions.
- [ ] Do not expose server-only secrets to client bundles.
- [ ] Do not claim production readiness from prototype flows.

## Repo guardrails

- [x] Build deploys on Vercel.
- [x] GitHub verification workflow exists.
- [x] CODEOWNERS exists and points to the current repository owner.
- [x] PR template exists and requires scope, risk, validation, and architecture impact.
- [ ] Branch protection is enabled in GitHub settings.
- [ ] Required checks are enabled after the verification workflow completes at least once.

## Sprint 0B scaffold

- [ ] Create `/apps/rider` placeholder plan.
- [ ] Create `/apps/driver` placeholder plan.
- [ ] Create `/apps/admin` placeholder plan.
- [ ] Create `/packages/ui` placeholder plan.
- [ ] Create `/packages/types` placeholder plan.
- [ ] Create `/packages/design-tokens` placeholder plan.
- [ ] Create `/supabase` foundation scaffold.
- [ ] Add ADR for Firebase removal and Supabase migration direction.
- [ ] Add ADR for prototype-money restrictions.
- [ ] Add ADR for client/server authority boundaries.

## Supabase foundation rules

- [ ] Supabase config must be introduced as environment-driven setup only.
- [ ] Service-role keys must never appear in client code.
- [ ] Row-level security must be assumed required for every table.
- [ ] Auth, profile, trips, payments, dispatch, and admin domains must stay separated.
- [ ] No payment or wallet table can be treated as live until ledger, reconciliation, and webhook controls exist.

## UI preservation rules

- [ ] Preserve the current lightweight premium Hatid visual direction.
- [ ] Preserve the canonical Hatid wordmark direction.
- [ ] Do not add heavy icon sets or visual clutter without approval.
- [ ] Keep onboarding, rider search, quote, profile, and payment screens honest about prototype limitations.

## Validation required before closing Sprint 0B

Run and paste results in the PR:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Also confirm:

- [ ] Vercel latest deployment is READY.
- [ ] `/` opens.
- [ ] `/login` opens.
- [ ] `/signup` opens.
- [ ] `/rider/search` opens.
- [ ] `/rider/ride-options` opens with query parameters.
- [ ] `/profile` opens.
- [ ] `/profile/payment` opens.

## Exit criteria

Sprint 0B is complete when the repo has automated checks, stable deployment, practical ownership, documented architecture boundaries, and a clear scaffold path for Supabase and multi-app work.
