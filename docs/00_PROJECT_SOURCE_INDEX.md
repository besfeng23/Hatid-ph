# Hatid Project Source Index

This folder is the source of truth for turning Hatid from a Firebase/Next.js prototype into a production-grade ride-hailing, delivery, driver, payment, dispatch, safety, admin, and compliance platform.

## Non-negotiable architecture rules

1. The client is never authoritative for trips, dispatch, payments, payouts, wallet balances, admin overrides, compliance state, driver eligibility, or audit records.
2. Firebase Auth can remain the identity layer.
3. Firestore may be used for client-facing read models/projections, not as the authoritative source for money, dispatch, payouts, or trip state.
4. PostgreSQL/PostGIS is the target authoritative store for trips, dispatch, fare quotes, ledgers, payouts, driver/compliance records, and audit logs.
5. Cloud Run services own business commands. Cloud Tasks owns retries/timers. Pub/Sub owns domain fanout. Cloud Scheduler owns periodic jobs.
6. Payment and wallet behavior must be ledger-derived, server-owned, idempotent, auditable, and reconciled.
7. SpeedCash is a later-phase payment/remittance/payout adapter candidate only. It must not become Hatid's MVP wallet, payment authority, or payout authority until legal, security, webhook, settlement, and reconciliation due diligence passes.
8. AI is not core. It comes after trip, payment, driver, support, safety, and admin operations are safe.

## Recommended reading order

1. `02_CURRENT_REPO_AUDIT.md`
2. `03_PRODUCTION_ARCHITECTURE.md`
3. `04_PHILIPPINES_REGULATORY_CONTEXT.md`
4. `07_DATABASE_SCHEMA.md`
5. `08_TRIP_STATE_MACHINE.md`
6. `09_DISPATCH_AND_MATCHING_ENGINE.md`
7. `10_MAPS_ROUTING_AND_FARE_ENGINE.md`
8. `11_PAYMENT_LEDGER_AND_PAYOUTS.md`
9. `12_DRIVER_ONBOARDING_AND_COMPLIANCE.md`
10. `13_SAFETY_AND_INCIDENT_RESPONSE.md`
11. `14_ADMIN_AND_OPERATIONS_CONSOLE.md`
12. `15_SECURITY_AND_RBAC.md`
13. `16_TESTING_AND_QA_PLAN.md`
14. `18_IMPLEMENTATION_ROADMAP.md`
15. `20_CODEX_IMPLEMENTATION_RULES.md`
26. `26_OPEN_QUESTIONS_AND_LEGAL_REVIEW.md`

## Phase order

- Phase 0: repo cleanup and honesty
- Phase 1: auth/profile correctness
- Phase 2: real data model and write boundaries
- Phase 3: trip state machine
- Phase 4: maps/geocoding/fare quote
- Phase 5: driver onboarding
- Phase 6: driver availability and dispatch
- Phase 7: payment ledger and receipts
- Phase 8: admin console
- Phase 9: safety tools
- Phase 10: payouts and reconciliation
- Phase 11: analytics and AI
- Phase 12: production hardening and launch readiness
