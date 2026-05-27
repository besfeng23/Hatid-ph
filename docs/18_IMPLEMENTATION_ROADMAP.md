# Implementation Roadmap

## Rule

Do not skip phases. UI polish does not make Hatid production-safe.

## Phase 0: Repo cleanup and honesty

Goal: stop prototype behavior from pretending to be production.

Tasks:

- rename package/app identity
- rewrite README
- remove build-error suppression
- label demo/mock modules clearly
- move hardcoded demo data under `/src/lib/demo`
- remove fake payment-success language
- add project-source docs

Acceptance:

- no mock path claims production behavior
- typecheck/build status reported honestly
- docs exist

Do not build yet:

- real dispatch
- wallet
- SpeedCash
- payouts
- AI

## Phase 1: Auth/profile correctness

Goal: reliable identity and profile writes.

Tasks:

- await login/signup promises
- handle auth errors correctly
- make profile save await server/write success
- introduce role model
- document rider/driver/admin boundaries

Acceptance:

- login/signup failures show accurate errors
- profile success only appears after persistence

## Phase 2: Real data model and write boundaries

Goal: server-owned data authority.

Tasks:

- define authoritative PostgreSQL schema
- define Firestore projection model
- define API command boundaries
- add audit/event taxonomy

Acceptance:

- production-critical writes are not client-owned

## Phase 3: Trip state machine

Goal: one authoritative trip lifecycle.

Tasks:

- create trip status types
- create transition validation
- add tests
- design server command handlers

Acceptance:

- invalid transitions fail
- terminal states cannot restart

## Phase 4: Maps/geocoding/fare quote

Goal: real locations and auditable quotes.

Tasks:

- provider abstraction
- service area validation
- fare quote versioning
- quote expiry

Acceptance:

- quote can be replayed for support/disputes

## Phase 5: Driver onboarding

Goal: no unverified drivers online.

Tasks:

- driver application state
- document upload/review model
- vehicle ownership model
- expiry reminders

Acceptance:

- availability blocked unless driver + vehicle + docs are valid

## Phase 6: Driver availability and dispatch

Goal: first real dispatch loop.

Tasks:

- location ingest
- availability gate
- nearest driver query
- offer timeout
- dispatch locks
- manual dispatch fallback

Acceptance:

- no double assignment
- stale drivers ignored

## Phase 7: Payment ledger and receipts

Goal: real money correctness.

Tasks:

- PSP abstraction
- payment intents
- verified callbacks
- double-entry ledger
- receipt generation
- refund path

Acceptance:

- every financial event posts balanced ledger entries
- fake client payment success ignored

## Phase 8: Admin console

Goal: operations can run Hatid.

Tasks:

- live trips
- driver review
- support/disputes
- payment/refund views
- audit log viewer
- RBAC

Acceptance:

- no database surgery needed for normal ops

## Phase 9: Safety tools

Goal: minimum serious safety posture.

Tasks:

- SOS event
- emergency contacts
- trip share
- incident reports
- safety queue

Acceptance:

- safety events preserve evidence and page/notify ops

## Phase 10: Payouts and reconciliation

Goal: pay drivers correctly.

Tasks:

- payable calculation
- payout batches
- payout provider callbacks
- failure/retry
- reconciliation queue
- SpeedCash due diligence only if still desired

Acceptance:

- payout statements reconcile to ledger and provider records

## Phase 11: Analytics and AI

Goal: insight after control.

Tasks:

- event contracts
- BigQuery export
- dashboards
- AI support summaries later

Acceptance:

- metrics have stable definitions
- AI has human review for risky areas

## Phase 12: Production hardening and launch readiness

Goal: launch without self-deception.

Tasks:

- load tests
- rollback drills
- backup restore drills
- incident runbooks
- legal/compliance review
- monitoring/alerts

Acceptance:

- launch checklist passes
