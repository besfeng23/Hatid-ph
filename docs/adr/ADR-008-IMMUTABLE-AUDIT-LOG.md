# ADR-008: Immutable Audit Log

**Date:** 2023-10-27

**Status:** Approved

## Context

As a platform dealing with finance, compliance, and user safety, we have a non-negotiable requirement for a complete, tamper-proof record of all critical system activities. We must be able to answer "Who did what, and when?" for any significant event.

This includes:

*   Changes to user permissions
*   Driver approvals or suspensions
*   Financial transactions
*   Handling of PII
*   Manual overrides by admin staff

Storing this information in regular database tables that can be updated or deleted is not sufficient for a true audit trail.

## Decision

We will implement a dedicated, immutable audit log. This will be a new schema (`audit`) in our PostgreSQL database (ADR-003) with a single, append-only `events` table.

1.  **Append-Only:** The application role that writes to this table will only have `INSERT` permissions. It will not have `UPDATE` or `DELETE` permissions. This will be enforced at the database level.
2.  **Trigger-Based Logging:** We will use PostgreSQL triggers to automatically capture changes (`INSERT`, `UPDATE`, `DELETE`) on critical tables (e.g., `core.users`, `finance.wallets`, `compliance.cases`) and record them into the `audit.events` table.
3.  **Context Capture:** The triggers will capture the old state, the new state, the user who made the change (`current_user_id`), the timestamp, and the source of the change (e.g., API call, admin action).
4.  **Application-Level Logging:** For events that don't correspond to a simple table change (e.g., "User logged in"), our Service Layer (ADR-006) will explicitly write events to the audit log.

## Consequences

*   **Benefits:**
    *   **High Integrity:** The log is tamper-resistant because it cannot be changed, even by the application itself.
    *   **Complete Traceability:** Provides a full history of all significant actions, which is essential for compliance, security investigations, and debugging.
    *   **Decoupling:** Auditing is handled automatically at the database level for most data changes, so developers don't have to remember to write audit log entries in their application code.
*   **Costs:**
    *   **Increased Storage:** The audit log can grow very large and will require a data management/archival strategy in the long term.
    *   **Performance Overhead:** Database triggers add a small amount of overhead to every write operation on audited tables. This must be monitored.
    *   **Complexity:** Writing and maintaining the trigger functions requires specialized PostgreSQL knowledge.
