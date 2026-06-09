# ADR-009: Row Level Security (RLS)

**Date:** 2023-10-27

**Status:** Approved

## Context

Data security and privacy are paramount. A user should only be able to see and modify their own data. A driver should not see another driver's earnings. An admin should have clearly defined permissions.

The traditional approach is to enforce these permissions within the application's business logic (e.g., in the Service Layer, ADR-006). If a user requests a resource, the service code checks if `resource.userId === currentUser.id`.

This approach is fragile:

*   **It's Easy to Forget:** A developer might forget to add the check in one of the many places data is accessed.
*   **It's Not Universal:** It only protects data accessed via the service layer. It does not protect against direct database queries, analytics tools, or bugs that might expose data incorrectly.

## Decision

We will use PostgreSQL's **Row Level Security (RLS)** as the fundamental layer of our security model. RLS policies are the ultimate source of truth for data access.

1.  **Default Deny:** All tables will have RLS enabled with a default `DENY` policy. This means no one can access any data unless a specific policy grants them permission.
2.  **Policy-Based Access:** We will create specific RLS policies on our tables. These policies are SQL expressions that determine whether a row is visible or modifiable for a given user and operation (SELECT, INSERT, UPDATE, DELETE).
    *   Example: A policy on the `core.profiles` table might be `(auth.uid() = id)`, ensuring a user can only see their own profile.
    *   Example: A policy on the `trips.trips` table might be `(auth.uid() = rider_id OR auth.uid() = driver_id)`, allowing either the rider or driver to see their trip data.
3.  **Application Logic Complements RLS:** The Service Layer will still perform high-level checks (e.g., "Is this user an admin?"), but the final, granular data filtering will always be handled by RLS at the database level.

## Consequences

*   **Benefits:**
    *   **Defense in Depth:** Even if there is a bug in the application logic, the database itself prevents unauthorized data access. It acts as a final, powerful security backstop.
    *   **Centralized Rules:** Security policies live with the data itself, not scattered throughout the application code.
    *   **Universality:** The rules apply to all connections to the database, whether from our API, the Supabase dashboard, or an analytics tool.
*   **Costs:**
    *   **Performance:** RLS adds a small overhead as the policy expression must be evaluated for every query.
    *   **Complexity:** Writing and debugging RLS policies can be complex, especially for intricate rules.
    *   **Testing:** Requires a dedicated testing strategy to ensure that RLS policies are working as intended.
