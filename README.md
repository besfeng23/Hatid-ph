# Hatid

Hatid is a Philippines-focused ride-hailing, delivery, driver, dispatch, payment, payout, safety, admin, and compliance platform.

## Current status

Hatid is currently a prototype. It is not production-ready. Existing UI or mocked behavior must not be treated as production system authority.

**Hatid is now Supabase-first and Firebase is prohibited.**

The frozen production direction uses Supabase Auth, Supabase PostgreSQL/PostGIS, Supabase Storage, Supabase Edge Functions, Vercel, Cloudflare/WAF protection, and Redis Streams initially. Production-critical state must be server-owned, auditable, recoverable, organization-scoped, and protected by default-deny RLS.

## Documentation authority

Start with the documentation authority index:

- [`docs/README.md`](docs/README.md)
- [`docs/architecture/00_ARCHITECTURE_BASELINE_V1.md`](docs/architecture/00_ARCHITECTURE_BASELINE_V1.md)
- [`docs/governance/26_FINAL_ARCHITECTURE_GOVERNANCE_AUDIT.md`](docs/governance/26_FINAL_ARCHITECTURE_GOVERNANCE_AUDIT.md)
- [`docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md`](docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md)
- [`docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md`](docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md)

Documents under `docs/legacy/` are superseded historical references. They must not be used as implementation or architecture authority.

## Frozen implementation boundaries

- The client is never authoritative for trips, dispatch, driver availability, payment status, balances, payouts, administrative overrides, onboarding approvals, safety incidents, or compliance data.
- Tenant-owned business records require `organization_id`.
- Default-deny RLS and pgTAP coverage are mandatory for production tables.
- Trip, onboarding, payout, refund, AML, and compliance lifecycles must use the workflow engine.
- Finance authority is the immutable double-entry ledger; wallet and account balances are projections only.
- Audit, idempotency, and durable outbox foundations precede business logic.
- External provider calls must not occur inside critical database transactions.

## Implementation start rule

Sprint 0B is the only approved next implementation phase. Follow [`docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md`](docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md).

This repository does not claim Sprint 0B is complete merely because governance documents exist.

## Development

```bash
npm install
npm run dev
```

The development server uses port 9002 by default.

## Required checks

Run available checks before review:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Environment

Copy `.env.example` to `.env.local` for local development.

Never commit `.env`, service account keys, payment secrets, provider credentials, or private keys.
