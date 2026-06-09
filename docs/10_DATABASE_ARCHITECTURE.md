# 10_DATABASE_ARCHITECTURE

**Source Decisions**

*   FD-101
*   FD-201
*   FD-301
*   FD-302
*   FD-401
*   FD-601
*   FD-602
*   FD-702

**Dependencies**

*   06_DOMAIN_MODEL.md
*   07_WORKFLOW_ENGINE.md
*   08_PERMISSION_MATRIX.md
*   09_EVENT_CATALOG.md

---

**Database Strategy**

*   **Primary Database:** PostgreSQL
*   **Platform:** Supabase
*   **Spatial Engine:** PostGIS
*   **Authorization:** RLS (Row Level Security)
*   **Migration Strategy:** Expand → Migrate → Contract

---

**Database Principles**

*   Single Source of Truth
*   Audit First
*   Finance First
*   RLS First
*   Immutable Event History
*   Workflow Driven

---

**Schema Architecture**

*   **auth:** Managed by Supabase Auth
*   **core:** Users, Profiles, Saved Locations, Preferences
*   **trip:** Trips, Trip Events, Trip Locations, Dispatch Decisions, Delivery Records
*   **finance:** Wallet Accounts, Ledger Entries, Payments, Payouts, Settlements, Reconciliation
*   **audit:** Audit Logs, Change History, Security Events
*   **analytics:** Read Models, Aggregations, Dashboards, KPIs

---

**Core Tables**

*   core.users
*   core.profiles
*   core.saved_locations
*   core.user_preferences

---

**Driver Tables**

*   core.drivers
*   core.driver_status
*   core.driver_ratings

---

**Vehicle Tables**

*   core.vehicles
*   core.vehicle_documents

---

**Trip Tables**

*   trip.trips
*   trip.trip_events
*   trip.trip_locations
*   trip.dispatch_attempts
*   trip.trip_ratings

---

**Finance Tables**

*   finance.wallet_accounts
*   finance.ledger_entries
*   finance.payment_transactions
*   finance.payout_requests
*   finance.settlements
*   finance.reconciliation_runs

---

**Compliance Tables**

*   core.compliance_cases
*   core.verifications
*   core.suspensions

---

**Audit Tables**

*   audit.audit_logs
*   audit.security_events
*   audit.data_changes

---

**Analytics Tables**

*   analytics.daily_metrics
*   analytics.trip_metrics
*   analytics.driver_metrics
*   analytics.revenue_metrics
*   analytics.support_metrics

---

**PostGIS Strategy**

*   **Tables:**
    *   trip.trip_locations
    *   core.saved_locations
    *   core.driver_locations
*   **Indexes:** GIST indexes mandatory.
*   **Spatial Queries:**
    *   Nearest Driver
    *   ETA Calculation
    *   Service Zone Detection
    *   Heat Maps
    *   Geofencing

---

**Partitioning Strategy**

*   **trip.trip_events:** Monthly partitioning
*   **audit.audit_logs:** Monthly partitioning
*   **finance.ledger_entries:** Monthly partitioning

---

**RLS Requirements**

*   Enabled on every business table.
*   No exceptions.
*   No public access.
*   All access permission-driven.

---

**Audit Requirements**

*   Every create
*   Every update
*   Every delete
*   Every approval
*   Every payout
*   Every suspension

Must generate audit records.
