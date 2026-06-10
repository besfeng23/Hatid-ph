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

# Trip State Machine

## Rule

Trip state is server-authoritative. The client may request a transition, but only the trip service can approve and persist it.

Every transition must be:

- validated
- idempotent
- audited
- event-recorded
- projected to Firestore only after authoritative write succeeds

## Statuses

- `draft`
- `quoted`
- `searching`
- `matched`
- `driver_assigned`
- `driver_arriving`
- `arrived`
- `in_progress`
- `completed`
- `cancelled_by_rider`
- `cancelled_by_driver`
- `no_show`
- `expired`
- `disputed`
- `refunded`

## Allowed transition matrix

| From | Allowed next states |
|---|---|
| `draft` | `quoted`, `expired`, `cancelled_by_rider` |
| `quoted` | `searching`, `expired`, `cancelled_by_rider` |
| `searching` | `matched`, `expired`, `cancelled_by_rider` |
| `matched` | `driver_assigned`, `expired`, `cancelled_by_rider` |
| `driver_assigned` | `driver_arriving`, `cancelled_by_rider`, `cancelled_by_driver`, `expired` |
| `driver_arriving` | `arrived`, `cancelled_by_rider`, `cancelled_by_driver`, `disputed` |
| `arrived` | `in_progress`, `no_show`, `cancelled_by_rider`, `cancelled_by_driver`, `disputed` |
| `in_progress` | `completed`, `disputed` |
| `completed` | `disputed`, `refunded` |
| `cancelled_by_rider` | `disputed`, `refunded` |
| `cancelled_by_driver` | `disputed`, `refunded` |
| `no_show` | `disputed`, `refunded` |
| `expired` | none |
| `disputed` | `refunded` |
| `refunded` | none |

## Transition ownership

| Transition group | Owner service |
|---|---|
| quote creation/expiry | pricing-service + trip-service |
| search/match/offer expiry | dispatch-service |
| assignment | dispatch-service + trip-service transaction |
| pickup/arrival/start/completion | trip-service |
| cancellation/no-show | trip-service + policy engine |
| dispute/refund | support-service + payment-service + ledger-service |

## Required events

- `trip.requested`
- `trip.quoted`
- `trip.quote_expired`
- `trip.search_started`
- `dispatch.offer_created`
- `dispatch.offer_expired`
- `dispatch.offer_accepted`
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

## Required scheduled jobs

- quote expiry
- dispatch offer expiry
- stale driver location scan
- abandoned searching-trip scan
- no-show waiting timer
- payment capture timeout
- payout hold release
- refund status polling/replay

## Minimum TypeScript API

```ts
export type TripStatus =
  | 'draft'
  | 'quoted'
  | 'searching'
  | 'matched'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled_by_rider'
  | 'cancelled_by_driver'
  | 'no_show'
  | 'expired'
  | 'disputed'
  | 'refunded';

export function canTransitionTripStatus(from: TripStatus, to: TripStatus): boolean;
export function assertTripStatusTransition(from: TripStatus, to: TripStatus): void;
export function isTerminalTripStatus(status: TripStatus): boolean;
```

## Production test cases

- cannot complete trip from `searching`
- cannot assign two drivers to one trip
- cannot start trip without assignment
- cannot complete trip twice
- cancellation fee policy applies only in approved states
- refund creates ledger adjustment, not trip mutation
- expired trip cannot re-enter active state
