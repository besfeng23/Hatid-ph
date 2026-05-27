# Postgres Schema and Migrations

## Rule

PostgreSQL/PostGIS is the target authoritative store for production-critical Hatid data. Schema changes must be versioned, reviewable, reversible where possible, and tested.

## Migration folder target

Future implementation should add:

```text
/db
  /migrations
  /schema
  /seeds
  /fixtures
```

## Migration principles

- One migration per logical change.
- No destructive production migration without backup and rollback plan.
- Use additive migrations first: create tables, add nullable fields, backfill, then enforce constraints.
- Write indexes intentionally.
- Keep enum/status constraints aligned with TypeScript types.
- Never bypass ledger constraints for convenience.

## Required extensions

Expected:

- `postgis`
- `uuid-ossp` or database-native UUID generation strategy

## Core migration batches

### Batch 1: identity and roles

- `users`
- `rider_profiles`
- `driver_profiles`
- `admin_users`
- `roles_permissions`

### Batch 2: compliance and vehicles

- `driver_verification`
- `driver_documents`
- `vehicles`
- `fleets`
- `fleet_drivers`

### Batch 3: locations and service areas

- `saved_locations`
- `service_areas`
- `driver_locations_live`
- `driver_location_history`

### Batch 4: trips and state machine

- `ride_requests`
- `fare_quotes`
- `trips`
- `trip_events`

### Batch 5: dispatch

- `dispatch_offers`
- `dispatch_locks`

### Batch 6: payments and providers

- `payment_intents`
- `payments`
- `provider_webhook_events`
- `refunds`

### Batch 7: ledger

- `wallet_accounts`
- `ledger_journals`
- `ledger_entries`
- `driver_earnings`

### Batch 8: payouts

- `payouts`
- `payout_batches`

### Batch 9: support and safety

- `disputes`
- `support_tickets`
- `sos_events`
- `incident_reports`

### Batch 10: growth, notifications, audit, AI

- `traffic_incidents`
- `promos`
- `referrals`
- `loyalty_accounts`
- `notifications`
- `audit_logs`
- `ai_recommendation_records`

## Required constraints

- Trip status enum or check constraint.
- Driver availability gate enforced by service logic and backed by status constraints.
- Provider webhook unique constraint on provider + event ID.
- Payment intent idempotency key uniqueness.
- Dispatch lock uniqueness on active trip.
- Ledger journal balanced by service-level transaction and tested invariant.
- Ledger entries append-only by policy and database permissions.

## Index guidance

- users: `auth_uid`
- trips: `rider_id,status`, `driver_id,status`, `created_at`, `region,status`
- dispatch: geospatial index on driver location, `driver_id,status`, offer expiry
- payments: `provider,provider_ref`, `trip_id`, `status`
- ledger: `account_id,posted_at`, `journal_id`
- payouts: `beneficiary_id,status,created_at`, `provider_ref`
- support: `status,assignee,priority`, linked trip/payment IDs
- audit: `actor_id,created_at`, `resource_type,resource_id`

## Seed data rule

Only seed safe public/internal config. Do not seed fake drivers, fake trips, fake payments, fake balances, or fake payout records into production.
