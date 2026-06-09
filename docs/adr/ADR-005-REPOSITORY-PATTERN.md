# ADR-005: Repository Pattern

**Date:** 2023-10-27

**Status:** Approved

## Context

Our business logic (services) needs to interact with the database. A common anti-pattern is to embed data access logic (e.g., SQL queries, Supabase client calls) directly within the business logic.

This leads to:

*   **Poor Testability:** It's hard to unit test business logic without a live database connection.
*   **Code Duplication:** The same queries are often rewritten in multiple places.
*   **Difficult Refactoring:** Changing the database schema or a query requires finding and updating every place it's used.
*   **Leaky Abstractions:** The business layer becomes tightly coupled to the data access implementation (e.g., Supabase, Knex, Prisma), making it difficult to change in the future.

## Decision

We will use the **Repository Pattern** to abstract data access from our business logic. A repository will mediate between the domain and data mapping layers using a collection-like interface for accessing domain objects.

For each core entity (e.g., `User`, `Trip`, `Wallet`), we will create a repository class (e.g., `UserRepository`, `TripRepository`).

*   The **Service Layer** will only interact with the Repository.
*   The **Repository** will contain all the Supabase/PostgreSQL-specific code for querying and mutations.
*   The Repository interface will be defined in terms of the domain (e.g., `getUserById(id)`, `createTrip(tripData)`), not in terms of the database.

## Consequences

*   **Benefits:**
    *   **Testability:** We can easily mock the repository interface in our service-layer tests, allowing for fast, isolated unit tests.
    *   **Decoupling:** The business logic is completely decoupled from the data access technology. We could swap Supabase for another ORM or database driver with zero changes to the service layer.
    *   **Centralization:** All data access logic for an entity is in one place, making it easy to manage, optimize, and refactor.
    *   **Clarity:** The separation of concerns is clear. Services handle "what to do," and repositories handle "how to get the data."
*   **Costs:**
    *   Adds another layer of abstraction, which can increase the initial amount of code to be written.
    *   Requires a disciplined approach from the team to not bypass the repository and put data access logic in the services.
