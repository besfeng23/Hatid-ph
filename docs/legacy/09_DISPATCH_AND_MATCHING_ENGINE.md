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

# Dispatch and Matching Engine

## Rule

Driver availability and dispatch are server-owned. A driver toggle in the app is only a request to become available; it is not authoritative.

## MVP dispatch model

A driver may be eligible for offers only when all conditions are true:

- driver profile approved
- vehicle approved
- required documents valid and unexpired
- driver not suspended
- app has recent trusted location heartbeat
- driver explicitly requested online state
- no active trip or dispatch lock
- service type supported
- region/service area supported

## MVP matching flow

1. Rider accepts valid fare quote.
2. `trip-service` moves trip to `searching`.
3. `dispatch-service` queries eligible nearby drivers using PostGIS/geohash.
4. Dispatch creates a `dispatch_offer` with expiry.
5. Driver accepts or rejects.
6. Acceptance tries to acquire dispatch lock transactionally.
7. If lock succeeds, trip becomes `driver_assigned`.
8. If offer expires/rejects, next candidate receives offer.
9. After configured failures, request expires or moves to manual dispatch.

## V2 dispatch scoring

Later scoring can include:

- ETA/distance
- service type
- vehicle type
- driver acceptance rate
- cancellation rate
- completion rate
- recent workload fairness
- zone balancing
- risk flags
- document/vehicle freshness
- customer safety blocks

Do not let ratings dominate early dispatch. Ratings can reinforce unfair marketplace outcomes and should be a review input, not a blind ranking engine.

## Location update guidance

| Driver state | Suggested heartbeat |
|---|---|
| offline | none |
| online idle | 15-30 seconds |
| offered trip | 5-15 seconds |
| assigned/arriving | 5-10 seconds |
| in progress | 5-10 seconds with privacy controls |

## Privacy rule

- Before assignment, riders must not see exact driver location.
- After assignment, riders may see trip-scoped driver location.
- After completion/cancellation, exact live sharing stops.
- Admin views should use role-scoped precision.

## Anti-spoofing signals

- timestamp freshness
- impossible speed checks
- device integrity/app attestation where available
- GPS accuracy metadata
- repeated teleporting
- foreground/background state where available
- driver behavior anomalies

## Race condition controls

- dispatch locks keyed by trip ID
- unique active offer constraints where needed
- transactional assignment
- idempotency key on accept command
- offer expiry via Cloud Tasks

## Manual dispatch

Admin manual dispatch must:

- require dispatcher role
- validate driver eligibility
- require reason code
- emit audit log
- notify rider and driver
- preserve original failed dispatch attempts

## Metrics

- time to first offer
- offer acceptance rate
- average match time
- offer expiry rate
- cancellation rate by state
- stale location rate
- ghost driver rate
- manual dispatch rate
- driver idle time
- rider abandonment rate
