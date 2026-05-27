# Payment, Ledger, and Payouts

## Non-negotiable rules

1. No client-side balance mutation.
2. No admin direct balance edits.
3. All balances are ledger-derived.
4. All payment and payout commands are idempotent.
5. All webhooks are signature-verified and replay-safe.
6. Reconciliation is required before real-money launch.
7. Provider status is external evidence; Hatid ledger is internal truth after verified posting.

## MVP stance

Do not launch a consumer wallet in MVP. Start with:

- cash trips with receipt tracking
- licensed PSP collection for cashless trips
- server-owned payment intents
- provider webhooks
- double-entry ledger
- manual-reviewed driver payout preparation
- daily reconciliation reports

## Providers to evaluate

- PayMongo
- Maya
- Xendit
- Dragonpay
- SpeedCash

## SpeedCash rule

SpeedCash must not be integrated as a live rider payment, wallet, remittance, or driver payout rail until due diligence proves:

- official API documentation
- secure authentication model
- webhook/event support
- signature verification or equivalent replay protection
- settlement reporting
- reconciliation files/API
- refund/reversal support
- payout failure handling
- operational support/SLA
- BSP/regulatory posture
- merchant onboarding legality
- finance/admin controls

Until then, treat SpeedCash only as a future adapter candidate.

## Ledger accounts

Minimum internal accounts:

- `rider_receivable`
- `psp_clearing`
- `cash_collected_by_driver`
- `driver_payable`
- `platform_revenue`
- `promo_expense`
- `refund_liability`
- `payout_clearing`
- `speedcash_clearing` if approved later
- `speedcash_suspense` if approved later

## Example journal patterns

### Cashless completed trip

- debit `psp_clearing`
- credit `rider_receivable`
- debit `rider_receivable`
- credit `driver_payable`
- credit `platform_revenue`

### Cash completed trip

- debit `cash_collected_by_driver`
- credit `rider_receivable`
- debit `rider_receivable`
- credit `driver_payable`
- credit `platform_revenue`

### Promo discount

- debit `promo_expense`
- credit `rider_receivable`

### Refund

- debit `refund_liability` or reversal account
- credit `psp_clearing` or provider clearing account

### Driver payout

- debit `driver_payable`
- credit `payout_clearing`
- after success: debit `payout_clearing`, credit bank/provider settlement account

### Failed payout

- debit `payout_clearing`
- credit `driver_payable`
- create payout failure event and retry/hold workflow

### SpeedCash cash-in candidate flow

Only after approval:

- create payment intent with idempotency key
- wait for verified SpeedCash event/settlement evidence
- debit `speedcash_clearing`
- credit `rider_receivable` or appropriate trip receivable
- reconcile settlement file/API against ledger posting

### SpeedCash payout candidate flow

Only after approval:

- debit `driver_payable`
- credit `speedcash_clearing`
- on success: debit `speedcash_clearing`, credit settlement account
- on failure: reverse to `driver_payable` and create failure queue item

### Reconciliation mismatch

- do not manually edit balance
- move unmatched amount to suspense account
- create reconciliation case
- require finance role + audit reason for resolution

## Payment service responsibilities

- create payment intents
- validate quote/trip relationship
- store provider refs
- handle webhooks
- verify signatures
- deduplicate provider events
- emit payment domain events
- never trust client success screens

## Ledger service responsibilities

- post balanced journals
- reject unbalanced journals
- provide account statements
- produce read-model balances
- support reversals/adjustments, not edits
- enforce append-only entries

## Payout service responsibilities

- calculate payable amounts
- apply holds
- create payout batches
- call payout provider
- handle provider callbacks
- retry failures through Cloud Tasks
- reconcile provider and bank settlement

## Admin controls

- finance can review payments and payout batches
- finance cannot directly edit balances
- refunds require reason codes
- payout retries require audit logs
- reconciliation resolution requires dual control for high amounts

## Launch blockers

- no verified PSP webhooks
- no ledger tests
- no reconciliation jobs
- no refund path
- no payout failure path
- no finance audit logs
- unclear SpeedCash compliance posture
