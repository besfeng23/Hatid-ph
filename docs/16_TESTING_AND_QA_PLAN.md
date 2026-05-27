# Testing and QA Plan

## Rule

No production feature ships without tests for its authority boundary. UI tests alone are not enough.

## Required test layers

| Layer | Purpose |
|---|---|
| TypeScript/typecheck | Prevent type regressions. |
| Unit tests | Pure functions: state machine, fare math, ledger balance checks. |
| Integration tests | API command handlers and database transactions. |
| Firestore rules tests | Projection access control. |
| Payment callback tests | Signature checks, idempotency, replay safety, failure handling. |
| Ledger tests | Balanced journals and immutable entries. |
| Dispatch simulation tests | Offer expiry, locks, reassignment, stale drivers. |
| RBAC tests | Admin/support/finance/safety permission boundaries. |
| Reliability tests | Auth failures, provider callback failures, rate-limited flows. |
| E2E smoke tests | Rider/driver/admin critical flows. |

## Phase-specific tests

### Phase 0

- build/typecheck/lint must not be suppressed
- docs exist
- mock/demo code clearly labeled

### Phase 1

- login/signup promise handling
- profile save success only after write success
- auth guard behavior

### Phase 2

- schema validation
- command boundary tests
- Firestore projection rule tests

### Phase 3

- trip transition matrix
- invalid transition rejection
- idempotent command replay
- event creation per transition

### Phase 4

- fare quote calculation
- quote expiry
- route provider abstraction
- service area validation

### Phase 5

- driver cannot go online when rejected, suspended, or expired
- vehicle ownership validation
- document expiry reminders

### Phase 6

- dispatch lock prevents double assignment
- stale driver ignored
- offer timeout triggers next candidate
- manual dispatch creates audit log

### Phase 7

- payment callback deduplication
- ledger journal balance
- refund reversal
- failed payment handling
- fake client success ignored

### Phase 10

- payout retry
- payout failure reversal
- reconciliation mismatch queue
- no direct balance mutation

## Required CI gates

- `npm run typecheck`
- `npm run lint` if available/fixed
- `npm run build`
- unit tests
- rules tests once configured

## Acceptance rule

A feature is not done until the failure path is tested. Happy-path-only tests are demo theater.
