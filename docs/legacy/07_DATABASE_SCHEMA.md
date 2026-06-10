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

# Database Schema

## Rule

PostgreSQL/PostGIS is the target authoritative database for production-critical Hatid data. Firestore is a projection/read-model layer for clients.

No client writes directly to authoritative trip, dispatch, payment, ledger, payout, audit, safety, or compliance tables.

## Authoritative PostgreSQL domains

### Identity

- `users`
- `rider_profiles`
- `driver_profiles`
- `admin_users`
- `roles_permissions`

### Driver, vehicle, fleet, compliance

- `driver_verification`
- `driver_documents`
- `vehicles`
- `fleets`
- `fleet_drivers`

### Location and service area

- `saved_locations`
- `service_areas`
- `driver_locations_live`
- `driver_location_history`

### Trips and dispatch

- `ride_requests`
- `fare_quotes`
- `trips`
- `trip_events`
- `dispatch_offers`
- `dispatch_locks`

### Payments and ledger

- `payment_intents`
- `payments`
- `provider_webhook_events`
- `refunds`
- `wallet_accounts`
- `ledger_journals`
- `ledger_entries`
- `driver_earnings`

### Payouts

- `payouts`
- `payout_batches`

### Support, safety, operations

- `disputes`
- `support_tickets`
- `sos_events`
- `incident_reports`
- `traffic_incidents`

### Growth and analytics

- `promos`
- `referrals`
- `loyalty_accounts`
- `notifications`
- `audit_logs`
- `ai_recommendation_records`

## Minimum table design pattern

Every authoritative table should include:

- `id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by` where applicable
- `status` where lifecycle applies
- immutable event table when state changes matter
- external reference columns for provider IDs where needed
- idempotency keys for external commands/webhooks

## Privacy classification

| Table family | Classification |
|---|---|
| public config | public/internal |
| users/profiles | confidential |
| driver docs/KYC | restricted |
| live locations | restricted |
| trips/events | confidential/restricted depending payload |
| payments/ledger/payouts | restricted |
| support/safety | confidential/restricted |
| audit logs | restricted |

## Migration priority

1. Trip state machine tables.
2. Driver/vehicle eligibility tables.
3. Fare quote tables.
4. Dispatch offer/lock tables.
5. Payment intent/payment tables.
6. Ledger tables.
7. Payout tables.
8. Support/safety tables.
9. Analytics/AI tables.

## Required constraints

- Trip status must be constrained to known statuses.
- Ledger entries must balance by journal.
- Ledger entries must be append-only.
- Provider webhook events must be unique by provider + provider event ID.
- Payment intents must be unique by idempotency key.
- Dispatch locks must prevent two drivers accepting the same trip.
- Driver cannot be available without approved profile, valid vehicle, valid documents, and no suspension.

## Firestore projection rule

Firestore read models may duplicate selected data for app display, but they are replaceable. If a Firestore projection conflicts with PostgreSQL, PostgreSQL wins.
