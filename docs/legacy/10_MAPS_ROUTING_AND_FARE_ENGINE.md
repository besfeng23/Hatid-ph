# SUPERSEDED DOCUMENT

This document is preserved for historical reference only.

It is NOT an active architecture source of truth.

Active authority is:

* `docs/architecture/00_ARCHITECTURE_BASELINE_V1.md`
* `docs/governance/26_FINAL_ARCHITECTURE_GOVERNANCE_AUDIT.md`
* `docs/adr/ADR-001-REMOVE-FIREBASE.md`
* `docs/adr/ADR-002-SUPABASE-FIRST.md`
* `docs/adr/ADR-003-ORGANIZATION-FIRST-MULTITENANCY.md`
* `docs/adr/ADR-004-LEDGER-FIRST-FINANCE.md`
* `docs/adr/ADR-005-WORKFLOW-ENGINE-FIRST.md`
* `docs/adr/ADR-006-EVENT-STREAMING.md`
* `docs/adr/ADR-007-OBSERVABILITY-OPENTELEMETRY.md`
* `docs/adr/ADR-008-REPOSITORY-GOVERNANCE.md`
* `docs/adr/ADR-009-CANONICAL-UI-UX.md`

If this document conflicts with the active architecture baseline, the active baseline wins.

---

# Maps, Routing, and Fare Engine

## Current state

The current app uses placeholder map imagery and hardcoded prices/ETAs. That is not a fare engine and not a routing system.

## MVP provider recommendation

Use Google Maps Platform for MVP unless commercial terms or coverage testing prove otherwise.

Required capabilities:

- Places autocomplete
- geocoding
- reverse geocoding
- route calculation
- distance/time estimate
- traffic-aware ETA where available
- route matrix for dispatch candidate ETA

## Later provider strategy

Design an abstraction layer so Hatid can later evaluate:

- Mapbox for search/routing/cost leverage
- self-hosted OpenStreetMap/MapLibre components for rendering or specialized use cases
- commercial geocoding/routing alternatives

Do not rely on public free geocoding endpoints for production ride-hailing.

## Fare engine rule

Fare calculation is server-owned and versioned. The client displays a quote; it does not calculate authoritative price.

## Fare components

```text
rider_total =
  base_fare
+ distance_fare
+ time_fare
+ service_type_multiplier
+ tolls
+ waiting_fee
+ cancellation_or_no_show_fee
+ platform_or_booking_fee
+ surge_component
- promo_discount
```

Driver payable:

```text
driver_net_payable =
  driver_gross_trip_earnings
+ incentive
- penalty
- commission_or_take_rate
- cash_collected_offset
```

## Fare quote record must store

- quote ID
- rider ID
- pickup/dropoff snapshot
- provider place IDs where available
- route geometry/hash
- route distance
- ETA
- pricing version
- service type
- fare breakdown
- promo applied
- surge flag and reason
- expiry timestamp
- idempotency key

## Quote lifecycle

1. rider enters pickup/dropoff
2. server geocodes/validates service area
3. pricing-service computes quote
4. quote stored with expiry
5. rider accepts quote
6. quote validity is checked again before trip search starts

## Caching rules

Can cache:

- place autocomplete session results within provider terms
- geocode results where allowed
- service-area checks
- pricing configuration

Do not cache recklessly:

- live traffic-sensitive ETA beyond short TTL
- live driver candidate route matrix beyond dispatch window
- precise user location without privacy basis

## Dispute/audit requirement

Support must be able to replay why a rider was quoted and charged a fare. Store pricing version and route inputs. Do not overwrite completed trip fare facts.
