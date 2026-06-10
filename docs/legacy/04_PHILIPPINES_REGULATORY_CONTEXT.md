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

# Philippines Regulatory Context

> This is not legal advice. Hatid needs Philippine counsel and regulatory specialists before any live launch.

## Why this matters

Hatid is not just a software app if it brokers rides, transport, delivery, payments, payouts, or wallet-like services. It enters regulated operating domains: transport, consumer protection, payments, privacy, tax, safety, insurance, and labor/contractor operations.

## Transport / TNVS review areas

Before launching passenger rides, obtain legal review on:

- Whether Hatid is acting as a Transportation Network Company or similar regulated operator.
- LTFRB accreditation/franchise/CPC requirements.
- Driver/operator/fleet contractual structure.
- Vehicle eligibility requirements.
- Fare schedule approval/constraints.
- Surge pricing legality and disclosure.
- Passenger safety obligations.
- Insurance requirements and claims handling.
- Common-carrier diligence exposure.
- Motorcycle passenger transport restrictions versus motorcycle delivery.

## Delivery review areas

Delivery may have a different legal posture from passenger TNVS. Still review:

- Vehicle and driver requirements.
- Package restrictions.
- Food delivery handling if applicable.
- Merchant contracts.
- Lost/damaged item liability.
- Proof of delivery requirements.
- Consumer complaint and refund workflows.

## Payments / wallet / payout review areas

Before offering wallet balances, stored value, cash-in/cash-out, remittance, or driver cashout:

- BSP e-money issuer implications.
- Operator of Payment System implications.
- Merchant acquiring implications.
- Payment facilitator role.
- Remittance/cashout licensing implications.
- AML/KYC obligations.
- Partner PSP due diligence.
- Driver payout rail due diligence.
- SpeedCash due diligence if considered.

## Data Privacy Act review areas

Hatid will process personal data, sensitive identity documents, precise location, trip history, payment metadata, support transcripts, and safety incidents. Required work includes:

- Appoint a DPO if applicable.
- Privacy impact assessment.
- Privacy notice and consent flows.
- Data subject access/export/delete processes.
- Breach notification procedure.
- Access logging for admin/support views.
- Retention and deletion schedules.
- Vendor/processor agreements.

## Tax / receipts / invoicing review areas

- BIR registration and invoicing requirements.
- Electronic invoice/receipt obligations where applicable.
- Platform commission reporting.
- Driver payout reporting.
- Refund/cancellation/no-show receipt logic.
- Marketplace/agent/principal tax characterization.

## Consumer protection review areas

- Fare transparency.
- Cancellation policy.
- Refund policy.
- Failed payment handling.
- Complaint handling channels.
- Support SLAs.
- Safety incident escalation.

## Compliance posture for MVP

MVP should avoid stored-value wallet and automated cashout unless approved by counsel and a regulated provider partner. Start with simpler, auditable flows:

- cash rides with receipt trail
- cashless collections through licensed PSP
- no user-held transferable wallet
- no SpeedCash production rail until due diligence passes
- manual driver payout reconciliation until automated payout is proven

## Legal review checklist

- [ ] TNVS/TNC operating model
- [ ] delivery operating model
- [ ] driver/fleet contracts
- [ ] vehicle requirements
- [ ] insurance scope
- [ ] fare policy
- [ ] cancellation/refund/no-show policy
- [ ] PSP contracts
- [ ] SpeedCash legal/compliance review if used
- [ ] privacy notice/DPO/PIA
- [ ] tax/invoicing policy
- [ ] consumer complaint process
- [ ] safety escalation runbooks
