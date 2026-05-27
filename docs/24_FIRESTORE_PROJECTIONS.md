# Firestore Projections

## Rule

Firestore is a projection/read-model layer for production-critical Hatid flows. It is not the authority for trips, dispatch, payments, ledgers, payouts, driver eligibility, or safety incidents.

If Firestore conflicts with PostgreSQL, PostgreSQL wins.

## Why projections exist

Firestore projections can provide:

- realtime client UI updates
- scoped rider trip views
- scoped driver offer views
- notification inboxes
- admin live views
- public configuration reads

They must be derived from authoritative backend writes/events.

## Projection collections

### `rider_trip_views/{tripId}`

Purpose: rider-facing trip status and display data.

Fields:

- `tripId`
- `riderId`
- `status`
- `pickupLabel`
- `dropoffLabel`
- `driverSummary`
- `vehicleSummary`
- `fareSummary`
- `etaSummary`
- `updatedAt`
- `projectionVersion`

Rules:

- rider can read only own trip view
- no direct client writes

### `driver_offer_views/{offerId}`

Purpose: driver-facing offer card.

Fields:

- `offerId`
- `driverId`
- `tripId`
- `pickupSummary`
- `dropoffSummary`
- `serviceType`
- `estimatedFare`
- `expiresAt`
- `status`

Rules:

- driver can read only own offers
- driver accepts/rejects through API, not Firestore write

### `driver_active_trip_views/{driverId}`

Purpose: driver current trip display.

Rules:

- driver reads own active trip projection only
- backend updates projection from trip/dispatch events

### `driver_day_summary_views/{driverId_date}`

Purpose: driver daily summary display.

Rules:

- derived from completed trips and ledger, not random UI data
- driver reads own projection only

### `admin_live_trip_views/{tripId}`

Purpose: admin operational visibility.

Rules:

- admin/dispatcher scoped by RBAC
- no direct client writes
- omit or mask restricted fields unless role allows

### `notification_inbox/{userId}/items/{notificationId}`

Purpose: user notifications.

Rules:

- user reads own inbox
- backend writes notifications

### `public_config/{configId}`

Purpose: public app config.

Examples:

- active service types
- maintenance messages
- supported regions
- app version notices

Rules:

- public read where safe
- backend/admin write only

### `support_case_views/{caseId}`

Purpose: support UI projection.

Rules:

- user can read own case summary
- support roles can read assigned/scoped cases
- restricted safety/payment details must not leak into general projection

## Projection writer

Projection writes should be done by backend services/workers after authoritative events:

- `trip-service`
- `dispatch-service`
- `payment-service`
- `ledger-service`
- `support-service`
- `safety-service`
- `notification-service`

## Firestore rules strategy

- default deny
- user-scoped reads
- role-scoped admin reads
- backend-only writes through Admin SDK/IAM
- rules tests required before production

## What not to store in projections

- raw payment provider secrets
- ledger internals beyond display summaries
- full KYC/KYB document details
- unrestricted live location history
- full safety incident narratives
- admin-only risk flags unless role scoped
