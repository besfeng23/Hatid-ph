# Hatid

Hatid is a Philippines-focused ride-hailing, delivery, driver, dispatch, payment, payout, safety, admin, and compliance platform.

## Current status

Hatid is currently a prototype. It is not production-ready.

The current app has a Next.js UI shell with rider, driver, profile, payment, demo location, and AI-related prototype files. Core production systems are not complete yet:

- dispatch is simulated or incomplete
- payments are simulated or incomplete
- wallet/payout behavior is not production-safe
- maps/routing/fare calculations are not production-grade
- driver onboarding and compliance are not complete
- admin/safety/support operations are not production-ready

Do not treat UI polish as product truth.

## Architecture direction

See `/docs` for the production source package.

The approved production direction is Supabase-first:

- Next.js PWA/frontends
- Supabase Auth for identity
- PostgreSQL via Supabase for authoritative data
- Supabase Storage for KYC/KYB, vehicle, support, and incident files
- Supabase Realtime plus event streaming for live updates
- Supabase Edge Functions for service boundaries
- Vercel for frontend hosting
- Redis Streams initially, Kafka later, for event streaming
- PostGIS for geospatial dispatch
- BigQuery or analytics warehouse later for AI-ready event streams

## Non-negotiable production rules

- The client is never authoritative for trips, dispatch, driver availability, payment status, wallet balances, payouts, admin overrides, KYC/KYB, safety incidents, or compliance data.
- All money flows must be server-owned, ledger-derived, auditable, idempotent, and reconciled.
- No admin direct balance edits
- No real payment/payout feature ships without webhook verification and reconciliation.
- SpeedCash is only a future adapter candidate until API, webhook, settlement, reconciliation, compliance, and legal review pass.
- AI is later. It must not silently decide driver approvals, suspensions, refunds, payout approvals, safety closure, fraud punishment, or legal/compliance outcomes.

## Development

```bash
npm install
npm run dev
```

Default dev server:

```bash
npm run dev
# Next.js dev server on port 9002
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Environment

Copy `.env.example` to `.env.local` for local development.

Never commit `.env`, service account keys, payment secrets, provider credentials, or private keys.

## Project source docs

Start here:

- `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md`
- `docs/governance/19_ARCHITECTURE_COMPLIANCE_CHECKLIST.md`
- `docs/governance/20_REPOSITORY_GOVERNANCE.md`
- `docs/frontend/21_UI_UX_BASELINE_V1.md`
- `docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md`
- `docs/governance/23_FIREBASE_ERADICATION_PLAN.md`
- `docs/architecture/24_FINAL_IMPLEMENTATION_ROADMAP.md`

## Phase order

1. Sprint 0B governance foundation
2. Legacy platform eradication
3. Organization foundation
4. IAM, JWT, RLS, and pgTAP
5. Audit, outbox, idempotency, and observability
6. Workflow engine
7. Finance core
8. Event streaming
9. Dispatch core
10. Trip lifecycle
11. Rider app
12. Driver app
13. Admin portal
14. Compliance
15. SRE hardening
