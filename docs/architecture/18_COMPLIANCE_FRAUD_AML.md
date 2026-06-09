# Hatid Compliance, Fraud, and AML Specification

Document ID: 18_COMPLIANCE_FRAUD_AML  
Status: Approved  
Scope: KYC, AML, fraud, chargebacks, DSAR, LER, BSP readiness, Data Privacy Act readiness

## Purpose

Hatid handles location data, identity data, payment data, wallet-like balances, payouts, and transportation safety data. Compliance and fraud controls are mandatory from foundation, not post-launch decoration.

## Compliance Domains

Required:

- driver KYC
- vehicle document verification
- AML velocity monitoring
- fraud investigation
- chargeback handling
- DSAR
- LER
- legal evidence retention
- maker-checker approvals
- BSP reporting readiness
- Data Privacy Act readiness

## Required Tables

### KYC

- `compliance.kyc_documents`
- `compliance.kyc_reviews`
- `compliance.document_expirations`

### AML

- `compliance.velocity_rules`
- `compliance.aml_alerts`
- `compliance.aml_cases`
- `compliance.str_reports`

### Legal

- `compliance.dsar_requests`
- `compliance.ler_requests`
- `compliance.legal_exports`
- `compliance.evidence_holds`

### Fraud

- `compliance.fraud_signals`
- `compliance.chargeback_cases`
- `compliance.suspicious_device_links`

## AML Risk Patterns

Detect:

- many rider accounts funding one driver
- many accounts sharing device fingerprint
- many accounts sharing IP address
- fake short-distance trips
- high top-up then immediate ride/payout pattern
- payout velocity spike
- repeated chargebacks
- impossible GPS patterns
- collusion between rider and driver

## Velocity Rules

Rules must support:

- per-user limits
- per-device limits
- per-IP limits
- per-payment-method limits
- per-driver limits
- per-organization limits
- per-time-window thresholds

Example rules:

- max top-up amount per 24h before enhanced review
- max payout amount per 24h
- max failed OTP attempts per hour
- max refunds per support agent per day
- max trips between same rider and driver per day

## Maker-Checker

Required for:

- manual ledger adjustment
- refund approval above threshold
- payout override
- chargeback resolution
- AML case closure
- DSAR/LER export
- compliance status override

No single actor may create and approve a high-risk financial or compliance action.

Table:

- `ops.approval_queue`

States:

- `REQUESTED`
- `PENDING_REVIEW`
- `APPROVED`
- `REJECTED`
- `EXECUTED`
- `CANCELLED`

## Chargeback Workflow

Workflow:

1. `CHARGEBACK_CREATED`
2. `INVESTIGATING`
3. `EVIDENCE_SUBMITTED`
4. `WON` or `LOST`
5. `LEDGER_REVERSAL_POSTED`
6. `CASE_CLOSED`

Every chargeback must connect to:

- original payment reference
- gateway report
- affected ledger journals
- rider account
- trip references where applicable
- reversal journal if lost

## Reconciliation

Required objects:

- `finance.reconciliation_batches`
- `finance.reconciliation_items`
- `finance.gateway_reports`
- `finance.bank_statements`
- `finance.reconciliation_exceptions`

Daily reconciliation must compare:

1. Internal ledger
2. Payment gateway settlement report
3. Bank statement

Unmatched items over 48 hours must become finance operations tasks.

## DSAR

Data Subject Access Requests must:

- be submitted through app/admin
- be workflow-driven
- export only authorized subject data
- generate secure expiring download link
- log payload hash
- log approving actor
- complete within compliance SLA

## LER

Law Enforcement Requests require:

- uploaded legal basis
- legal approval
- maker-checker workflow
- scoped extraction
- cryptographic hash of export
- immutable audit log

Direct SQL exports for legal requests are prohibited.

## Data Retention

Sensitive data retention must be documented by data class:

- trip exact location
- fuzzed location
- ledger entries
- KYC documents
- incident evidence
- support chat
- admin audit logs
- DSAR/LER exports

## PII Controls

PII must be minimized, masked in admin UI unless permissioned, excluded from logs, encrypted where required, and accessible only through approved service paths.

## Required Alerts

- AML alert spike
- STR report generated
- large manual refund
- large payout override
- admin bulk profile views
- DSAR/LER export generated
- failed reconciliation
- suspicious rider-driver collusion
