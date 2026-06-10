# SUPERSEDED DOCUMENT

This document is preserved for historical reference only.

It is NOT an active architecture source of truth.

Active authority is:

* `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md`
* `docs/governance/26_FINAL_ARCHITECTURE_GOVERNANCE_AUDIT.md`
* `docs/adr/ADR-001-REMOVE-FIREBASE.md`
* `docs/adr/ADR-002-SUPABASE-FIRST.md`
* `docs/adr/ADR-003-ORGANIZATION-FIRST-MULTITENANCY.md`
* `docs/adr/ADR-004-LEDGER-FIRST-FINANCE.md`
* `docs/adr/ADR-005-WORKFLOW-ENGINE-FIRST.md`
* `docs/adr/ADR-006-EVENT-STREAMING.md`
* `docs/adr/ADR-007-OBSERVABILITY-OPENTELEMETRY.md`
* `docs/adr/ADR-008-REPOSITORY-GOVERNANCE.md`
* `docs/adr/ADR-009-CANONICAL-UI-UX.md`

If this document conflicts with the active architecture baseline, the active baseline wins.

---

# Infrastructure and Deployment

## Target infrastructure

| Layer | Recommended service | Purpose |
|---|---|---|
| Frontend | Vercel or Firebase App Hosting | Next.js rider/driver/admin PWA UI only. |
| Auth | Firebase Auth | User identity, sessions, provider auth. |
| API/backend | Cloud Run | Authoritative business services. |
| Database | Cloud SQL PostgreSQL + PostGIS | Trips, dispatch, ledger, payouts, audit, compliance. |
| Realtime projections | Firestore | Client read models only. |
| File storage | Cloud Storage | KYC/KYB, vehicle docs, incident files. |
| Async jobs | Cloud Tasks | Retries, timeouts, webhook replay, offer expiry. |
| Events | Pub/Sub | Domain-event fanout and analytics export. |
| Scheduled jobs | Cloud Scheduler | Reconciliation, cleanup, expiry scans, reminders. |
| Analytics | BigQuery | Product, finance, safety, fraud, AI-ready event streams. |
| Secrets | Secret Manager | Provider keys, webhook secrets, DB credentials. |
| Observability | Cloud Logging, Monitoring, Error Reporting | Logs, metrics, alerts, runtime error grouping. |
| Edge security | Cloud Armor/App Check/rate limits | Bot, abuse, and custom backend protection. |

## What Vercel/Firebase App Hosting can own

- Next.js UI rendering.
- Static assets.
- Lightweight server rendering.
- Public marketing pages.
- Non-critical UI-only routes.

## What frontend hosting must not own

- Payment webhooks.
- Ledger posting.
- Payout execution.
- Dispatch loops.
- Driver-location ingest authority.
- Trip state transitions.
- Admin overrides.
- KYC/KYB document finalization.
- Reconciliation jobs.

## Environments

Minimum environments:

- local
- development
- staging
- production

Each must have separate:

- Firebase project/app where practical
- Cloud SQL database
- Firestore database/rules deployment
- service accounts
- Secret Manager secrets
- payment-provider keys
- webhook endpoints
- storage buckets
- analytics datasets

## Deployment gates

Production deploys require:

- typecheck pass
- lint pass
- build pass
- migration plan reviewed
- Firestore rules tested
- no secrets in repo
- staging smoke test
- rollback path
- monitoring/alerts active

## Backup and recovery

- PostgreSQL: automated backups + PITR.
- Firestore: scheduled backups/export for projections where needed.
- Cloud Storage: retention/object versioning for restricted documents if legally required.
- Run restore drills before production launch.

## Launch target

Before a pilot, define:

- RPO for trip/payment core
- RTO for backend failure
- incident owner
- rollback owner
- emergency communication channel
