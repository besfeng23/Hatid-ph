# ADR-002: Supabase First

**Date:** 2023-10-27

**Status:** Approved

## Context

Having decided to move off Firebase and onto a PostgreSQL-based stack (ADR-001), we need a platform that provides the developer experience of Firebase but with the power and flexibility of Postgres.

We need to solve for:

*   Authentication
*   Real-time data
*   Storage
*   Serverless functions
*   A managed database offering

Building all of this from scratch is time-consuming and detracts from our core business logic.

## Decision

We will adopt a "Supabase First" strategy. Supabase provides a suite of open-source tools built around a dedicated PostgreSQL database, including:

*   **Supabase Studio:** A user-friendly dashboard for managing the database and services.
*   **Supabase Auth:** A complete authentication system that integrates with Postgres Row Level Security (RLS).
*   **Supabase Storage:** For handling user uploads like driver photos and documents.
*   **Realtime:** For broadcasting database changes to clients.
*   **Edge Functions:** For serverless business logic.

This gives us the backend-as-a-service (BaaS) convenience we had with Firebase, but with the enterprise-grade foundation of PostgreSQL.

## Consequences

*   **Benefits:**
    *   Massively accelerates backend development.
    *   Provides a clear, integrated security model with Auth and RLS.
    *   Open-source core reduces vendor lock-in.
    *   Excellent local development story with the Supabase CLI.
*   **Costs:**
    *   We are dependent on the Supabase platform and its roadmap.
    *   Requires learning the Supabase ecosystem and its specific APIs.
    *   The free tier has limitations that we will quickly exceed, requiring a paid plan.
