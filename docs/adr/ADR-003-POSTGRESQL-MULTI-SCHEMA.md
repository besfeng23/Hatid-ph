# ADR-003: PostgreSQL Multi-Schema

**Date:** 2023-10-27

**Status:** Approved

## Context

With PostgreSQL as our core database (ADR-001, ADR-002), we need a strategy for organizing our database objects (tables, functions, views) to maintain clarity, manage permissions, and prevent a monolithic, unmanageable `public` schema.

The Hatid platform has distinct logical domains:

*   Core user and company data
*   Trip and dispatch logic
*   Financial ledgers
*   Compliance and case management
*   Audit trails

## Decision

We will adopt a multi-schema architecture within our PostgreSQL database. Each schema will correspond to a high-level domain or service within the platform.

Initial schema design:

*   `core`: For user profiles, drivers, vehicles, and other foundational data.
*   `trips`: For all data related to trip requests, dispatch, and tracking.
*   `finance`: For the double-entry ledger, wallets, and payout records. This schema will have the most restrictive access policies.
*   `compliance`: For case management, incident reports, and user suspension records.
*   `audit`: For the immutable audit log of all critical system events.
*   `public`: Will remain empty or used only for database-wide extensions.

## Consequences

*   **Benefits:**
    *   **Logical Separation:** Code and data are organized by domain, making the system easier to understand and maintain.
    *   **Granular Permissions:** We can set different access levels per schema, enhancing security (e.g., only the finance service can write to the `finance` schema).
    *   **Reduced Naming Conflicts:** Tables with the same name can exist in different schemas (e.g., `audit.users` vs `core.users`).
    *   **Scalability:** Facilitates breaking services out into separate databases in the future if needed.
*   **Costs:**
    *   Developers must be explicit about which schema they are querying (e.g., `SELECT * FROM finance.transactions`).
    *   Requires careful management of the `search_path` for roles.
    *   Cross-schema joins can be slightly less performant than intra-schema joins, though this is negligible at our scale.
