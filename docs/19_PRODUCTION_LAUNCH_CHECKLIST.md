# Production Launch Checklist

Hatid is not production-ready until this checklist passes. This is not marketing copy; it is the minimum bar for a controlled pilot.

## Repo and build

- [ ] package/app identity is Hatid-specific
- [ ] README describes real setup and prototype limitations
- [ ] no ignored TypeScript build errors
- [ ] no ignored ESLint build errors
- [ ] typecheck passes
- [ ] build passes
- [ ] secrets are not committed
- [ ] `.env.example` exists

## Architecture

- [ ] trip state is server-authoritative
- [ ] dispatch is server-authoritative
- [ ] driver availability is server-authoritative
- [ ] payment status is provider/webhook/server-authoritative
- [ ] balances are ledger-derived
- [ ] payouts are server-owned and reconciled
- [ ] Firestore is projection/read-model only for critical flows

## Trips and dispatch

- [ ] real trip state machine implemented
- [ ] trip transitions tested
- [ ] quote expiry implemented
- [ ] dispatch offer expiry implemented
- [ ] dispatch locks prevent double assignment
- [ ] stale drivers ignored
- [ ] manual dispatch fallback exists

## Maps and fare

- [ ] real geocoding provider integrated
- [ ] real route/ETA provider integrated
- [ ] fare quote versioning implemented
- [ ] fare quote replay available for disputes
- [ ] receipts explain fare components

## Driver onboarding

- [ ] driver application flow exists
- [ ] document upload is secured
- [ ] vehicle ownership model exists
- [ ] document expiry tracking works
- [ ] suspended/expired drivers cannot go online

## Payments and ledger

- [ ] PSP integration verified
- [ ] webhooks/callbacks verified and idempotent
- [ ] double-entry ledger implemented
- [ ] ledger tests pass
- [ ] refunds implemented
- [ ] cash trip accounting implemented
- [ ] reconciliation jobs implemented
- [ ] SpeedCash due diligence completed before any live SpeedCash feature

## Payouts

- [ ] driver payable calculation implemented
- [ ] payout batch flow implemented
- [ ] payout callback handling implemented
- [ ] payout failures reverse/hold correctly
- [ ] payout reconciliation works

## Admin and support

- [ ] live trip admin view exists
- [ ] driver verification queue exists
- [ ] support ticket queue exists
- [ ] refund/dispute workflow exists
- [ ] finance view exists
- [ ] audit log viewer exists
- [ ] admin RBAC enforced

## Safety

- [ ] SOS creates safety event
- [ ] emergency contacts supported
- [ ] incident reports supported
- [ ] safety queue staffed
- [ ] restricted access enforced for safety data

## Compliance and privacy

- [ ] legal review completed for launch model
- [ ] DPO/privacy owner assigned
- [ ] privacy notice reviewed
- [ ] privacy impact assessment completed
- [ ] data retention schedule approved
- [ ] breach response runbook exists
- [ ] tax/invoicing review completed
- [ ] insurance review completed

## Infrastructure

- [ ] staging/prod separated
- [ ] Secret Manager configured
- [ ] backups configured
- [ ] restore drill completed
- [ ] monitoring dashboards live
- [ ] error reporting live
- [ ] alert routing configured
- [ ] incident runbook tested

## Final rule

No real riders, real drivers, real payments, or real payouts until this checklist is materially complete and reviewed.
