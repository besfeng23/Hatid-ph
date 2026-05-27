# Event Taxonomy

## Rule

Events are records of domain facts. They are not loose analytics logs. Critical events must be emitted only after authoritative writes succeed.

## Event naming convention

Use dot-separated names:

```text
domain.action
```

Examples:

- `trip.requested`
- `dispatch.offer_created`
- `payment.succeeded`
- `ledger.journal_posted`

## Required event metadata

Every domain event should include:

- `eventId`
- `eventType`
- `occurredAt`
- `actorType`
- `actorId`
- `resourceType`
- `resourceId`
- `correlationId`
- `causationId`
- `idempotencyKey` where relevant
- `schemaVersion`
- `payload`

## Trip events

- `trip.requested`
- `trip.quoted`
- `trip.quote_expired`
- `trip.search_started`
- `trip.driver_assigned`
- `trip.driver_arriving`
- `trip.driver_arrived`
- `trip.started`
- `trip.completed`
- `trip.cancelled_by_rider`
- `trip.cancelled_by_driver`
- `trip.no_show`
- `trip.disputed`
- `trip.refunded`

## Dispatch events

- `dispatch.offer_created`
- `dispatch.offer_sent`
- `dispatch.offer_accepted`
- `dispatch.offer_rejected`
- `dispatch.offer_expired`
- `dispatch.assignment_locked`
- `dispatch.assignment_failed`
- `dispatch.manual_assignment_created`

## Driver events

- `driver.application_submitted`
- `driver.document_uploaded`
- `driver.review_approved`
- `driver.review_rejected`
- `driver.suspended`
- `driver.reactivated`
- `driver.availability_requested_online`
- `driver.availability_online_approved`
- `driver.availability_offline`
- `driver.location_heartbeat_received`
- `driver.location_stale`

## Payment and ledger events

- `payment.intent_created`
- `payment.provider_event_received`
- `payment.provider_event_verified`
- `payment.succeeded`
- `payment.failed`
- `payment.refund_requested`
- `payment.refund_succeeded`
- `payment.refund_failed`
- `ledger.journal_posted`
- `ledger.journal_reversed`
- `ledger.reconciliation_mismatch_detected`

## Payout events

- `payout.requested`
- `payout.batch_created`
- `payout.sent_to_provider`
- `payout.succeeded`
- `payout.failed`
- `payout.retry_scheduled`
- `payout.reconciled`

## SpeedCash candidate events

Only if approved later:

- `speedcash.event_received`
- `speedcash.event_verified`
- `speedcash.cash_in_confirmed`
- `speedcash.payout_sent`
- `speedcash.payout_succeeded`
- `speedcash.payout_failed`
- `speedcash.reversal_received`
- `speedcash.reconciliation_mismatch_detected`

## Support and safety events

- `support.ticket_created`
- `support.ticket_assigned`
- `support.ticket_resolved`
- `safety.sos_created`
- `safety.sos_escalated`
- `safety.incident_reported`
- `safety.account_block_created`
- `safety.case_closed`

## Admin/audit events

- `admin.role_changed`
- `admin.manual_dispatch_created`
- `admin.refund_decision_created`
- `admin.driver_review_decision_created`
- `admin.payout_retry_approved`
- `admin.restricted_record_viewed`

## Analytics rule

Analytics consumers may receive event copies through Pub/Sub/BigQuery. They must not become command authorities.
