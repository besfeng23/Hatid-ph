# ADR-001: Remove Firebase

**Date:** 2023-10-27

**Status:** Approved

## Context

The initial prototype was built on Firebase, utilizing Firestore, Firebase Auth, and Cloud Functions. While excellent for rapid prototyping, it presents long-term challenges for a production-grade, regulated platform in the Philippines.

Key issues:

*   **Vendor Lock-in:** Deep integration with the Firebase ecosystem makes future migration difficult and costly.
*   **Limited Querying:** Firestore's NoSQL structure is not ideal for the complex relational queries required for dispatch, finance, and analytics.
*   **Data Residency:** No straightforward options for Philippines data residency.
*   **Transactionality:** While Firestore has transaction support, it is not as robust as PostgreSQL for complex financial operations (e.g., a double-entry ledger).
*   **Tooling:** The ecosystem for PostgreSQL is more mature and flexible for data analysis, reporting, and debugging.

## Decision

We will move off the Firebase platform entirely.

This involves replacing:

*   **Firestore:** with PostgreSQL.
*   **Firebase Auth:** with Supabase Auth (which uses PostgreSQL).
*   **Cloud Functions:** with a service layer running on a separate compute instance (e.g., containerized service).

## Consequences

*   **Benefits:**
    *   Full control over the data model.
    *   Access to the powerful PostgreSQL ecosystem.
    *   Clear path to data residency and compliance.
    *   Avoids vendor lock-in.
    *   Enables robust, transactional financial systems.
*   **Costs:**
    *   Requires a complete rewrite of the backend.
    *   Requires more infrastructure management compared to the serverless model of Firebase.
    *   Steeper learning curve for developers not familiar with PostgreSQL.
