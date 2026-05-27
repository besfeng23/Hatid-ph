# Hatid

Hatid is a Philippines-focused ride-hailing, delivery, driver, dispatch, payment, payout, safety, admin, and compliance platform.

## Current status

Hatid is currently a prototype. It is not production-ready.

The current app has a Next.js/Firebase UI shell with rider, driver, profile, payment, Firestore, and AI-related prototype files. Core production systems are not complete yet:

- dispatch is simulated or incomplete
- payments are simulated or incomplete
- wallet/payout behavior is not production-safe
- maps/routing/fare calculations are not production-grade
- driver onboarding and compliance are not complete
- admin/safety/support operations are not production-ready

Do not treat UI polish as product truth.

## Architecture direction

See `/docs` for the production source package.

The intended production direction is hybrid:

- Next.js PWA/frontends
- Firebase Auth for identity
- Firebase/FCM for push and selected client-facing read models
- Firestore as projection/read-model layer only for production-critical flows
- Cloud Run for authoritative backend services
- Cloud Tasks for retries, expiries, timeouts, webhook replay, and payout retry
- Pub/Sub for domain event fanout
- Cloud Scheduler for reconciliation, cleanup, reminders, and expiry scans
- Cloud SQL PostgreSQL + PostGIS for authoritative trip, dispatch, fare, ledger, payout, driver, vehicle, audit, safety, and compliance data
- Cloud Storage for KYC/KYB, vehicle, support, and incident files
- BigQuery later for analytics and AI-ready event streams

## Non-negotiable production rules

- The client is never authoritative for trips, dispatch, driver availability, payment status, wallet balances, payouts, admin overrides, KYC/KYB, safety incidents, or compliance data.
- All money flows must be server-owned, ledger-derived, auditable, idempotent, and reconciled.
- No admin direct balance edits.
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

- `docs/00_PROJECT_SOURCE_INDEX.md`
- `docs/02_CURRENT_REPO_AUDIT.md`
- `docs/03_PRODUCTION_ARCHITECTURE.md`
- `docs/07_DATABASE_SCHEMA.md`
- `docs/08_TRIP_STATE_MACHINE.md`
- `docs/11_PAYMENT_LEDGER_AND_PAYOUTS.md`
- `docs/15_SECURITY_AND_RBAC.md`
- `docs/18_IMPLEMENTATION_ROADMAP.md`
- `docs/20_CODEX_IMPLEMENTATION_RULES.md`

## Phase order

1. Repo cleanup and honesty
2. Auth/profile correctness
3. Real data model and write boundaries
4. Trip state machine
5. Maps/geocoding/fare quote
6. Driver onboarding
7. Driver availability and dispatch
8. Payment ledger and receipts
9. Admin console
10. Safety tools
11. Payouts and reconciliation
12. Analytics and AI
13. Production hardening and launch readiness
