# 13_DISPATCH_ENGINE_SPEC

**Source Decisions**

*   FD-101
*   FD-103
*   FD-501
*   FD-801

**Dependencies**

*   06_DOMAIN_MODEL.md
*   07_WORKFLOW_ENGINE.md
*   10_DATABASE_ARCHITECTURE.md

---

**Purpose**

The Dispatch Engine is responsible for matching riders and senders with available drivers.

This is the core revenue-producing system of Hatid.

---

**Dispatch Principles**

Fastest acceptable match.

Not necessarily nearest driver.

Balance:

*   ETA
*   Driver utilization
*   Acceptance rate
*   Cancellation rate
*   Driver fairness

---

**Driver Availability States**

*   Offline
*   Online
*   Busy
*   Suspended
*   Unavailable

---

**Matching Workflow**

Trip Requested
↓
Driver Search
↓
Candidate Ranking
↓
Dispatch Offer
↓
Acceptance
↓
Assignment
OR
Retry

---

**Candidate Ranking Factors**

*   Distance
*   ETA
*   Driver Rating
*   Acceptance Rate
*   Cancellation Rate
*   Recent Activity
*   Zone Coverage

---

**Search Radius Strategy**

Initial Radius:
2 km

Expansion:
5 km

Expansion:
10 km

Expansion:
15 km

---

**Dispatch Retry Logic**

Attempt 1
↓
Attempt 2
↓
Attempt 3
↓
Escalation
↓
Failure

---

**Driver Location Updates**

Frequency:
5–10 seconds while active.

---

**Geofencing**

*   Service Areas
*   Restricted Areas
*   High Demand Areas
*   Airport Zones
*   Special Event Zones

---

**Surge Pricing Inputs**

*   Demand
*   Supply
*   Weather
*   Events
*   Traffic

---

**Dispatch KPIs**

*   Average Match Time
*   Acceptance Rate
*   Cancellation Rate
*   Driver Utilization
*   ETA Accuracy
*   Trip Completion Rate