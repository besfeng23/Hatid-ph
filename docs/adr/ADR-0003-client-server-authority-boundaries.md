# ADR-0003: Client/server authority boundaries

## Status

Accepted

## Context

Hatid includes UI flows for rider onboarding, ride search, fare estimates, profile, payments, and future dispatch operations. These domains involve safety, payments, identity, compliance, and operational correctness.

Client-side state is acceptable for previews and local UI interactions, but it must not become production truth for critical domains.

## Decision

The client may render UI, collect user input, and show prototype-only previews. The server must own critical authority.

Server-authoritative domains include:

1. Auth identity and session state.
2. Profile persistence and permissions.
3. Driver eligibility and availability.
4. Trip creation, assignment, status, cancellation, and completion.
5. Fare calculation used for charging or settlement.
6. Payment status, wallet balance, payouts, refunds, and ledger entries.
7. KYC, compliance, admin permissions, and audit logs.
8. Safety events and emergency escalation.

## Consequences

- Client-only mock data must not be treated as production truth.
- Any server-authoritative domain must have API, database, policy, and test coverage before it is considered live.
- UI can remain polished while backend truth is incomplete, but it must label incomplete domains honestly.
- Supabase RLS, server functions, and auditability are required for sensitive domains.

## Validation

Every PR touching server-authoritative domains must explain:

- what data is client-only,
- what data is server-owned,
- what policies or validations protect it,
- and whether the behavior is prototype-only or production-ready.
