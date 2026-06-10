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

# Driver Onboarding and Compliance

## Rule

No driver goes online unless all required onboarding, vehicle, document, and suspension checks pass server-side.

## Onboarding stages

1. account created
2. phone/email verified
3. driver profile submitted
4. identity documents uploaded
5. license uploaded
6. vehicle OR/CR uploaded
7. insurance/coverage documents uploaded if required
8. profile and vehicle photos uploaded
9. review queue
10. approved / rejected / needs more info
11. active / suspended / expired / deactivated

## Required entities

- `driver_profiles`
- `driver_verification`
- `driver_documents`
- `vehicles`
- `fleets`
- `fleet_drivers`
- `audit_logs`

## Document handling

- Upload through signed URLs.
- Store files in restricted Cloud Storage buckets.
- Finalize document records server-side after upload.
- Store checksum/hash.
- Track issue date, expiry date, reviewer, and decision.
- Alert drivers before document expiry.

## Vehicle controls

Vehicle record must include:

- driver/fleet owner
- plate number
- make/model/year
- color
- service type eligibility
- OR/CR document refs
- inspection/review status if applicable
- active/suspended/expired status

## Driver status model

- `applicant`
- `pending_documents`
- `under_review`
- `approved`
- `rejected`
- `suspended`
- `expired_documents`
- `deactivated`

## Suspension and appeal

Suspension must be server-owned and audit-logged. Reasons include:

- expired documents
- safety incident
- repeated cancellations/no-shows
- fraud/payment issue
- regulatory/compliance issue
- admin/manual review

Appeals must create support/compliance cases, not mutate status silently.

## Philippines review areas

Requires legal/regulatory review:

- TNVS/CPC/franchise structure
- driver/operator/fleet contracts
- vehicle eligibility
- insurance coverage
- passenger vs delivery motorcycle rules
- fare and operating-area restrictions
- document retention
- background-check legality and vendor selection

## MVP implementation

MVP should implement:

- driver profile application
- document upload placeholders using secure storage
- manual review queue
- vehicle ownership model
- document expiry fields
- server-side availability gate

Do not build:

- instant automated approval
- AI approval/rejection
- live driver payouts before verified onboarding
- fleet self-service scale before individual driver flow is correct
