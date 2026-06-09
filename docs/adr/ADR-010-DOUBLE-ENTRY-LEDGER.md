# ADR-010: Double-Entry Ledger

**Date:** 2023-10-27

**Status:** Approved

## Context

The Hatid platform moves money between different actors: riders, drivers, and the platform itself. We need an accounting system that is accurate, auditable, and resilient.

Simply incrementing or decrementing a `balance` column in a `wallets` table is insufficient and dangerous:

*   **It's not auditable:** You can see the current balance, but you can't see the history of how it got there.
*   **It's error-prone:** If a network error occurs halfway through a transaction (e.g., we debit the rider but fail to credit the driver), money can be lost or created out of thin air.
*   **It doesn't balance:** There is no way to verify that the sum of all user wallets equals the total assets held by the company.

## Decision

All financial movements will be recorded using a **Double-Entry Ledger** system, implemented in a dedicated `finance` schema in our PostgreSQL database.

This system will be based on three core tables:

1.  `finance.accounts`: Represents a store of value (e.g., `PAYMONGO_CASH`, `DRIVER_A_WALLET`, `PLATFORM_REVENUE`). Each account has a type (Asset, Liability, Equity, Revenue, Expense).
2.  `finance.journal_entries`: Represents a single financial event (e.g., "Trip Payment").
3.  `finance.ledger_entries`: Records the individual debits and credits for a journal entry. **For every journal entry, the sum of all debits must equal the sum of all credits.**

*   **Immutability:** Once created, ledger entries must not be updated or deleted. Corrections are made by creating a new, reversing journal entry.
*   **Atomicity:** The creation of a journal entry and its associated ledger entries must happen within a single database transaction to ensure they all succeed or fail together.

## Consequences

*   **Benefits:**
    *   **Accuracy & Consistency:** The fundamental accounting equation (Assets = Liabilities + Equity) ensures that the books are always balanced. Money cannot be created or destroyed.
    *   **Full Auditability:** Every change in balance is tied to a specific, immutable journal entry, providing a complete and trustworthy audit trail.
    *   **Clarity:** This is the standard, universally understood model for financial accounting.
*   **Costs:**
    *   **Complexity:** Implementing a double-entry ledger is more complex than simply updating a balance field.
    *   **Verbosity:** A single transaction (like a trip payment) will generate multiple rows in the `ledger_entries` table.
    *   **Performance:** Calculating a wallet's current balance requires summing all its ledger entries. This can be optimized using materialized views or summary tables.
