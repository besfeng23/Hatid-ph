# ADR-006: Service Layer

**Date:** 2023-10-27

**Status:** Approved

## Context

We need a clear and consistent place to implement the core business logic and workflows of the Hatid platform, such as creating a booking, processing a payout, or suspending a user.

Placing this logic directly in API route handlers or Supabase Edge Functions leads to:

*   **Unstructured Code:** Logic becomes scattered and hard to find.
*   **Poor Reusability:** The same logic cannot be easily shared between a public API, an admin panel, and a background worker.
*   **Difficult Testing:** Business logic becomes entangled with HTTP requests and responses, making it hard to unit test in isolation.
*   **Violation of Single Responsibility Principle:** Route handlers become responsible for both API concerns (parsing requests, sending responses) and business concerns.

## Decision

We will implement a **Service Layer** that contains all core business logic. This layer will be the primary orchestrator of the application's workflows.

*   **Structure:** We will create service classes based on domain (e.g., `TripService`, `WalletService`, `ComplianceService`).
*   **Responsibilities:**
    *   Orchestrate workflows by calling methods on repositories (ADR-005) and other services.
    *   Enforce business rules and validation.
    *   Raise events (ADR-007).
    *   Contain no data access or HTTP-specific code.
*   **Usage:** API controllers (e.g., in an Express server or Supabase Edge Functions) will be thin wrappers that call methods on the service layer. Their only job is to handle the HTTP request/response cycle and translate API inputs into calls to the service layer.

## Consequences

*   **Benefits:**
    *   **Clear Separation of Concerns:** Business logic is cleanly separated from both data access (repositories) and presentation (API controllers).
    *   **High Reusability:** The same service method can be invoked from an API, a background job, or a CLI script.
    *   **Excellent Testability:** Services are plain objects that can be instantiated and tested without a database or a running server.
    *   **Maintainability:** The entire business logic for a use case (e.g., "Cancel Trip") is contained within a single service method, making it easy to understand and modify.
*   **Costs:**
    *   Introduces another layer to the architecture, increasing the number of files and classes for any given feature.
    *   Requires discipline to keep the layer pure and not leak in concerns from other layers.
