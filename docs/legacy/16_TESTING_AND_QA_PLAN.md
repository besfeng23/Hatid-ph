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
