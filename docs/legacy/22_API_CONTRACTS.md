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

# API Contracts

## Rule

APIs accept requests. They do not let the client decide production truth.

## API design principles

- Commands are server-validated.
- Commands are idempotent where retries are possible.
- Responses include request IDs.
- Critical commands write audit/domain events.
- Client-facing reads come from scoped projections or authorized APIs.

## Core command APIs

### Auth/profile

- `POST /profile/rider`
- `PATCH /profile/rider`
- `POST /profile/driver/application`
- `PATCH /profile/driver/application`

### Fare quote

- `POST /fare-quotes`
- `GET /fare-quotes/{quoteId}`

### Trip

- `POST /trips`
- `POST /trips/{tripId}/accept-quote`
- `POST /trips/{tripId}/cancel`
- `POST /trips/{tripId}/arrive`
- `POST /trips/{tripId}/start`
- `POST /trips/{tripId}/complete`
- `GET /trips/{tripId}`

### Dispatch

- `POST /drivers/availability/request-online`
- `POST /drivers/availability/offline`
- `POST /driver-location/heartbeat`
- `POST /dispatch-offers/{offerId}/accept`
- `POST /dispatch-offers/{offerId}/reject`

### Payments

- `POST /payment-intents`
- `GET /payments/{paymentId}`
- `POST /payments/{paymentId}/refund-request`
- `POST /webhooks/{provider}`

### Ledger/payouts

- `GET /ledger/accounts/{accountId}/statement`
- `POST /payouts/request`
- `GET /payouts/{payoutId}`

### Support/safety

- `POST /support-tickets`
- `POST /trips/{tripId}/disputes`
- `POST /sos-events`
- `POST /incident-reports`

### Admin

- `GET /admin/live-trips`
- `POST /admin/dispatch/manual-assign`
- `POST /admin/drivers/{driverId}/review-decision`
- `POST /admin/refunds/{refundId}/decision`
- `GET /admin/audit-logs`

## Common request fields

- `idempotencyKey` for commands that may retry
- `clientRequestId`
- `actorContext` derived from auth, not trusted from client
- `reasonCode` for admin/safety/finance actions

## Common response fields

- `requestId`
- `resourceId`
- `status`
- `serverTime`
- `projectionVersion` where applicable

## Provider callbacks

Provider callbacks/webhooks must:

- verify signature/token
- store raw event safely
- deduplicate by provider event ID
- process idempotently
- enqueue retries through Cloud Tasks
- never trust client-return redirects as payment proof

## SpeedCash adapter note

If SpeedCash is approved later, it must be added as a provider adapter behind the same payment/payout interfaces. It must not get custom shortcuts that bypass ledger, reconciliation, callback verification, or admin controls.
