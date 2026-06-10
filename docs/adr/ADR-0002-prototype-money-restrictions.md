# ADR-0002: Prototype-money restrictions

## Status

Accepted

## Context

Hatid contains rider-facing payment and wallet-adjacent UI concepts. The current repository is a product preview and foundation, not an approved live-money system.

A ride-hailing and wallet-adjacent platform must not imply live stored value, payments, payouts, wallet balances, reversals, or settlements before backend controls exist.

## Decision

Hatid must treat all payment, wallet, payout, cash-out, and ledger-adjacent UI as prototype-only until production controls are implemented.

The app must not show fake live money movement as production truth.

Live-money behavior requires, at minimum:

1. Provider integration with documented settlement behavior.
2. Signature-verified webhooks.
3. Replay-safe and idempotent event handling.
4. Server-owned ledger-derived balances.
5. Reconciliation and admin review screens.
6. Refund, reversal, pending, failed, and disputed state handling.
7. Compliance and legal review.

## Consequences

- Payment screens can show planned rails, but must label them honestly.
- Cash can be shown as a simple ride payment preference only.
- Stored balance, wallet top-up, cash-out, send money, and payout flows must remain disabled unless a later ADR approves them.
- Client code must never be authoritative for balances or payment status.

## Validation

Every PR touching payments, wallet, ledger, payout, or provider adapter code must explain whether it changes prototype-only behavior or live-money behavior.

No PR may claim production readiness for money movement without meeting the controls above.
