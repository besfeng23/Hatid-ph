# Data Privacy and Governance

## Classification model

| Class | Examples | Rules |
|---|---|---|
| Public | public service config, public help text | Safe for public read. No personal data. |
| Internal | pricing versions, service-area config, operational metrics | Internal staff and services only. |
| Confidential | names, email, phone, saved places, trip history, support tickets | User-scoped read; admin access only by role and reason. |
| Restricted | government IDs, driver documents, live precise location, payment/ledger records, payout details, SOS/safety incidents | Strict least privilege, access logs, short retention where possible, no broad support access. |

## Personal data principles

- Collect only what Hatid needs for account, trip, safety, payment, compliance, and support operations.
- Keep precise location only as long as operationally required.
- Do not expose raw driver location before assignment.
- Do not expose safety incident details to ordinary support roles.
- Do not use trip/payment/safety data for AI without a documented purpose, minimization, and review process.

## Required governance workflows

- Privacy notice and consent records.
- Data subject access/export.
- Data deletion/deactivation workflow.
- Breach response runbook.
- Admin/support access logging.
- Vendor/processor inventory.
- Retention schedule.
- Privacy impact assessment before launch.
- DPO/legal review before handling KYC/KYB and location at scale.

## Retention guidance

| Data | MVP guidance |
|---|---|
| Raw driver live pings | Short TTL; keep only what dispatch/safety requires. |
| Trip summary and events | Retain for disputes, receipts, tax, and safety review. |
| KYC/KYB documents | Retain under legal/compliance policy; restrict access. |
| Support transcripts | Retain by ticket SLA and legal needs, then archive/delete. |
| Payment/ledger records | Retain under finance/tax/legal requirements. |
| Audit logs | Long retention; append-only. |
| AI prompts/outputs | Avoid raw PII; keep short unless needed for safety/fraud evidence. |

## Admin access rule

Every access to restricted data must record:

- actor
- role
- resource
- reason
- timestamp
- IP/device/session
- case/ticket reference where applicable

## Launch checklist

- [ ] privacy notice written and reviewed
- [ ] DPO/owner assigned
- [ ] PIA completed
- [ ] breach process documented
- [ ] retention schedule approved
- [ ] restricted-data access logs implemented
- [ ] user export/delete flow designed
- [ ] support/admin RBAC enforced
