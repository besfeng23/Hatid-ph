# ADR-007: Event-Driven Architecture

**Date:** 2023-10-27

**Status:** Approved

## Context

Many workflows in the Hatid platform require orchestrating multiple steps across different services. For example, when a trip is completed:

*   The `TripService` marks the trip as `COMPLETED`.
*   The `FinanceService` needs to calculate earnings and create ledger entries.
*   The `NotificationService` needs to send a receipt to the rider.
*   The `AnalyticsService` needs to record the trip completion.

Coupling the `TripService` directly to these other services (by calling them directly) would create a monolithic, tightly-coupled system. If the notification service fails, should the entire trip completion fail? This makes the system brittle and hard to maintain.

## Decision

We will adopt an **Event-Driven Architecture (EDA)** for decoupling services and handling asynchronous workflows. The Service Layer (ADR-006) will be the primary producer of events.

1.  **Event Production:** When a significant business event occurs (e.g., `TripCompleted`, `DriverApproved`, `PayoutRequested`), the responsible service will publish an event to a message bus/queue (e.g., RabbitMQ, or a simple `pg_notify` for initial implementation).
2.  **Event Payload:** The event will contain all relevant data for subscribers to act upon (e.g., `tripId`, `userId`, `amount`).
3.  **Event Consumption:** Other services will subscribe to the events they are interested in. They will listen for new events and trigger their own internal workflows when an event is received.

This creates a "choreography" where services react to events without being directly commanded by the event producer.

## Consequences

*   **Benefits:**
    *   **Decoupling:** Services are loosely coupled. The `TripService` does not need to know about the `NotificationService` or `AnalyticsService`; it only needs to announce that a trip was completed.
    *   **Asynchronous Processing:** Long-running tasks (like sending emails or processing analytics) can be handled in the background without blocking the primary user-facing workflow.
    *   **Resilience:** If a subscriber service is down, events can be queued and processed later once it recovers (with a suitable message bus).
    *   **Scalability & Extensibility:** It is easy to add new subscribers to an event without modifying the original publisher. For example, we could add a `FraudDetectionService` that listens to `TripCompleted` without changing the `TripService` at all.
*   **Costs:**
    *   **Increased Complexity:** Requires setting up and managing a message bus or eventing system.
    *   **Difficult Debugging:** Tracing a request flow across multiple asynchronous services is more complex than debugging a synchronous monolith.
    *   **Eventual Consistency:** Data is not updated instantly across the entire system. We must design for the fact that there will be a small delay between an event being published and all subscribers processing it.
