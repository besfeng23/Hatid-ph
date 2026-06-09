# 09_EVENT_CATALOG

## Source Decisions

FD-101
FD-201
FD-301
FD-302
FD-401

---

# Event Standards

All events must be:

*   Immutable
*   Timestamped
*   Traceable
*   Idempotent

---

# User Events

*   UserRegistered
*   UserVerified
*   UserSuspended

---

# Driver Events

*   DriverApplied
*   DriverApproved
*   DriverRejected
*   DriverSuspended
*   DriverReactivated

---

# Vehicle Events

*   VehicleSubmitted
*   VehicleApproved
*   VehicleRejected

---

# Trip Events

*   TripRequested
*   TripSearching
*   TripMatched
*   TripAccepted
*   TripArriving
*   TripStarted
*   TripCompleted
*   TripCancelled

---

# Delivery Events

*   DeliveryRequested
*   DeliveryMatched
*   DeliveryCollected
*   DeliveryCompleted
*   DeliveryCancelled

---

# Wallet Events

*   WalletCreated
*   WalletCredited
*   WalletDebited
*   WalletLocked
*   WalletUnlocked

---

# Payment Events

*   PaymentInitiated
*   PaymentAuthorized
*   PaymentCaptured
*   PaymentFailed
*   PaymentRefunded

---

# Payout Events

*   PayoutRequested
*   PayoutApproved
*   PayoutRejected
*   PayoutReleased

---

# Compliance Events

*   CaseOpened
*   InvestigationStarted
*   AccountSuspended
*   AccountReactivated

---

# Audit Events

*   AuditCreated
*   AuditArchived

---

# Event Requirements

Every event contains:

*   Event ID
*   Timestamp
*   Actor ID
*   Correlation ID
*   Source Service
*   Event Version
*   Payload

---

# Event Consumers

*   Analytics
*   Notifications
*   Audit
*   Operations
*   Finance
*   Compliance
