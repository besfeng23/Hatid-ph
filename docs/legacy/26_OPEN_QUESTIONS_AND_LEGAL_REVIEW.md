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

# Open Questions and Legal Review

This file tracks decisions that cannot be solved by code alone. Do not let Codex or implementation work guess these answers.

## Transport/legal questions

- Is Hatid operating as a TNC, TNVS platform, delivery platform, dispatcher, fleet operator, or a combination?
- What entity will hold regulatory obligations?
- What licenses, franchises, approvals, or accreditations are required before passenger rides?
- What service types are legally allowed at launch?
- Are motorcycle passenger rides allowed under Hatid's launch model, or only delivery?
- What fare model is permitted?
- Can surge pricing be used, and under what disclosure/approval constraints?
- What insurance coverage is required for passengers, drivers, delivery items, and incidents?

## Driver/fleet questions

- Are drivers independent contractors, fleet employees, platform partners, or another structure?
- What driver onboarding documents are legally required?
- What background checks are allowed and required?
- What vehicle documents and inspections are required?
- What happens when documents expire?
- What appeal process is required for rejection/suspension?

## Payment/wallet questions

- Is Hatid collecting as merchant of record, platform facilitator, agent, or another role?
- What PSP relationship is legally safest for MVP?
- Is Hatid an Operator of Payment System under the launch model?
- Would any wallet/cash-in/cash-out feature trigger BSP e-money or remittance obligations?
- What driver payout model is allowed without additional licensing?
- What records must be retained for payments, refunds, and payouts?

## SpeedCash-specific questions

SpeedCash must not be used live until these are answered:

- Does SpeedCash provide official merchant/API documentation?
- Does SpeedCash support payment confirmation callbacks/webhooks?
- Are callbacks signed or otherwise replay-safe?
- Does SpeedCash support payout/cashout APIs?
- Does SpeedCash provide settlement reports or reconciliation files/APIs?
- What is SpeedCash's BSP/compliance posture?
- What entity contracts with SpeedCash?
- What happens on failed/delayed/reversed transactions?
- Can SpeedCash support refunds/reversals?
- What operational SLA/support exists?
- What fraud controls exist for cash-in/cash-out?
- Would use of SpeedCash make Hatid a remittance/payment operator?

## Privacy questions

- Who is Hatid's DPO/privacy owner?
- What data subject rights workflow will be implemented?
- How long can precise driver/rider location be retained?
- What consent is required for trip sharing, emergency contacts, and AI features?
- What restricted data may support agents access?
- How will breach notification be handled?

## Tax/invoicing questions

- What receipts/invoices must Hatid issue?
- What must drivers issue, if anything?
- How are platform commissions reported?
- How are refunds/cancellations/no-show fees reported?
- What structured e-invoicing/e-reporting obligations apply?

## Safety questions

- What emergency escalation process is legally and operationally acceptable?
- What incident evidence should be retained?
- How are rider/driver blocks handled?
- When can a user be suspended pending investigation?
- What human review is required for adverse decisions?

## Decision log format

For every answered question, record:

- date
- decision
- source/counsel
- affected docs/files
- implementation impact
- review date
