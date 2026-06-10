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

# Production Architecture

## Decision

Hatid should use a hybrid production architecture.

Firebase remains useful for fast identity, push, and client-facing projections. It should not be the final authority for trips, dispatch, payments, payouts, ledgers, driver eligibility, or compliance records.

## Target architecture

```text
Client apps
  Rider PWA
  Driver PWA
  Admin/dispatcher console
  Fleet/operator portal later
  Merchant/delivery portal later
  Support console

Frontend/edge
  Vercel or Firebase App Hosting for Next.js UI
  CDN/WAF/rate limits
  Separate staging and production environments

Backend/API
  Cloud Run services
    auth-profile-service
    trip-service
    dispatch-service
    pricing-service
    maps-adapter-service
    driver-onboarding-service
    payment-service
    ledger-service
    payout-service
    support-service
    safety-service
    admin-service
    notification-service
    analytics-export-service
    ai-service later

Async/realtime
  Cloud Tasks for retries, expiries, delayed jobs, webhook replay
  Pub/Sub for domain events and analytics fanout
  Cloud Scheduler for recurring jobs
  Firestore projections for app views
  Optional Realtime Database only for presence if justified

Authoritative data
  Cloud SQL PostgreSQL + PostGIS
  Cloud Storage for KYC/KYB/incident files
  BigQuery for analytics

Security/compliance
  Firebase Auth
  Custom claims + server-side RBAC
  App Check
  Cloud Armor / rate limits
  Secret Manager
  IAM least privilege
  Audit logs
  Backups + PITR
```

## Source-of-truth boundaries

| Area | Production source of truth |
|---|---|
| User identity | Firebase Auth + `users` mirror |
| Trip lifecycle | PostgreSQL via trip-service |
| Dispatch | PostgreSQL/PostGIS via dispatch-service |
| Fare quote | PostgreSQL via pricing-service |
| Driver location | dispatch-service location ingest + PostGIS |
| Payments | payment-service + provider webhooks |
| Wallet/balance | double-entry ledger, never client state |
| Payouts | payout-service + payout provider callbacks |
| Admin actions | admin-service + immutable audit logs |
| Safety/SOS | safety-service + restricted audit trail |
| Client realtime UI | Firestore projections only |

## Why not Firebase-only

Firebase-only is fast for a prototype, but dangerous for Hatid's production core:

- Firestore is not a relational ledger database.
- Presence and high-frequency driver location are awkward in Firestore.
- Financial reconciliation needs transactional SQL-style consistency and auditability.
- Server SDKs bypass Firestore rules; all critical server access must rely on IAM and service authorization.
- Dispatch needs geospatial queries and locking that PostGIS handles better.

## Why PostgreSQL/PostGIS

- Transactional integrity.
- Geospatial queries for dispatch and service areas.
- Strong schema constraints.
- Auditable ledger tables.
- Safer payout/reconciliation workflows.
- Better fit for trip state transitions and immutable events.

## Migration path

1. Keep current UI running.
2. Add docs and types.
3. Add server-owned trip state machine.
4. Add PostgreSQL schema/migrations.
5. Add Cloud Run service boundaries.
6. Replace demo flows one domain at a time.
7. Use Firestore only as projection/read model for clients.

## Rule

Do not build flashy features until the boring core exists: trip authority, dispatch authority, fare authority, ledger authority, driver eligibility, audit logs, and support/safety operations.
