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

# Security and RBAC

## Security rule

Security cannot rely on UI hiding buttons. Critical authorization must be enforced in APIs, database access patterns, service accounts, Firestore rules for projections, and admin RBAC.

## Identity

- Firebase Auth for user identity.
- Server verifies Firebase ID tokens.
- Custom claims may carry coarse role hints.
- Authoritative role/permission records live server-side.

## Roles

- `rider`
- `driver`
- `support_agent`
- `dispatcher`
- `driver_reviewer`
- `safety_agent`
- `finance_agent`
- `fraud_reviewer`
- `ops_manager`
- `admin`
- `security_admin`

## Authorization layers

1. Firebase Auth token verification.
2. App Check verification for supported app/backend calls.
3. API route/service RBAC.
4. PostgreSQL service-owned writes.
5. Firestore rules for projection access.
6. Cloud IAM least privilege for service accounts.
7. Admin action audit logs.

## Critical boundaries

| Action | Authority |
|---|---|
| create trip request | trip-service |
| transition trip state | trip-service |
| assign driver | dispatch-service + trip-service transaction |
| driver online approval | driver-service + dispatch-service |
| payment status | payment-service via verified webhook/provider check |
| ledger posting | ledger-service |
| payout state | payout-service |
| refund approval | support/payment workflow |
| admin override | admin-service with reason and audit |
| KYC/KYB approval | driver-onboarding service |

## Required controls

- App Check on Firebase and custom backend endpoints where applicable.
- Cloud Armor/rate limiting for public endpoints.
- reCAPTCHA or equivalent on high-abuse flows.
- Secret Manager for provider/API secrets.
- No committed `.env`, service account keys, or private credentials.
- Webhook signature verification.
- Provider event deduplication.
- Audit logs for every sensitive admin action.
- Admin MFA requirement.
- Separate staging and production projects/secrets.

## High-risk flows

- signup/login abuse
- promo redemption abuse
- payment method attach
- payment webhook spoofing
- payout destination changes
- SpeedCash payout/cashout if later enabled
- driver onboarding fraud
- admin data browsing
- safety incident access

## Launch checklist

- [ ] no TypeScript/lint/build suppression
- [ ] Firebase rules tested
- [ ] API auth middleware implemented
- [ ] App Check strategy documented
- [ ] admin role matrix implemented
- [ ] audit log immutable enough for launch
- [ ] service accounts least-privilege
- [ ] secrets only in Secret Manager/provider env stores
- [ ] webhook verification tested
- [ ] incident response runbook exists
