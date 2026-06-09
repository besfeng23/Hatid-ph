# 12_MASTER_ARCHITECTURE

**Source Decisions**

All Approved Founder Decisions

**Dependencies**

01–11 Documents

---

**Architecture Vision**

Hatid shall be a scalable mobility and logistics marketplace capable of nationwide deployment while maintaining financial integrity, operational visibility, security, compliance, and auditability.

---

**Architectural Style**

*   Domain Driven Design
*   Repository Pattern
*   Service Layer
*   Event Driven Architecture
*   CQRS Ready Analytics
*   Workflow Driven Operations

---

**Logical Architecture**

1.  Presentation Layer
2.  Application Layer
3.  Domain Layer
4.  Infrastructure Layer
5.  Analytics Layer

---

**Presentation Layer**

*   Next.js
*   React
*   TypeScript
*   PWA Ready

---

**Application Layer**

*   Application Services
    *   Trip Service
    *   Dispatch Service
    *   Wallet Service
    *   Payment Service
    *   Compliance Service
    *   Notification Service
    *   Analytics Service

---

**Domain Layer**

*   Auth
*   Identity
*   Users
*   Drivers
*   Vehicles
*   Trips
*   Dispatch
*   Wallet
*   Payments
*   Compliance
*   Documents
*   Notifications
*   Analytics
*   Audit
*   Operations

---

**Infrastructure Layer**

*   Supabase
*   PostgreSQL
*   PostGIS
*   Storage
*   Realtime
*   Edge Functions

---

**External Integrations**

*   PayMongo
*   Google Maps
*   SMS Provider
*   Email Provider

---

**Repository Pattern**

*   UI never accesses database directly.
*   Only repositories access persistence.

---

**Service Layer Rules**

*   Business logic prohibited in UI.
*   Business logic belongs in services.

---

**Event Architecture**

Domain Services
↓
Domain Events
↓
Event Consumers

**Consumers**

*   Notifications
*   Analytics
*   Audit
*   Operations
*   Finance
*   Compliance

---

**Analytics Architecture**

*   CQRS Ready
*   Read Models
*   Aggregations
*   Materialized Views
*   Dashboard Queries

---

**Deployment Architecture**

*   **Frontend:** Vercel
*   **Backend:** Supabase
*   **Storage:** Supabase Storage
*   **Maps:** Google Maps Platform
*   **Payments:** PayMongo

---

**Scalability Strategy**

*   **Phase 1:** Single City
*   **Phase 2:** Metro Expansion
*   **Phase 3:** Multi City
*   **Phase 4:** Nationwide

---

**Governance Rules**

*   Documentation First
*   Approval First
*   Audit First
*   Security First
*   Finance First
*   No architecture drift
*   No schema drift
*   No undocumented implementation
