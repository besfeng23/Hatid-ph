# 07_WORKFLOW_ENGINE

## Source Decisions

FD-101
FD-201
FD-202
FD-302
FD-401

---

# Purpose

Define all workflow state machines.

No state transitions outside approved workflows.

---

# Driver Onboarding Workflow

*   Draft
*   Submitted
*   Under Review
*   Approved
*   Rejected
*   Suspended

---

# Vehicle Verification Workflow

*   Draft
*   Submitted
*   Under Review
*   Approved
*   Rejected

---

# Trip Workflow

*   Requested
*   Searching
*   Matched
*   Accepted
*   Arriving
*   Picked Up
*   In Transit
*   Completed
*   Cancelled

---

# Cancellation Rules

*   Requested → Cancelled
*   Searching → Cancelled
*   Matched → Cancelled
*   Accepted → Cancelled

After Picked Up:

Restricted.

Requires incident process.

---

# Delivery Workflow

*   Requested
*   Searching
*   Matched
*   Accepted
*   Package Collected
*   In Transit
*   Delivered
*   Cancelled

---

# Payout Workflow

*   Requested
*   Validation
*   Finance Review
*   Approved
*   Processing
*   Paid
*   Rejected

---

# Compliance Workflow

*   Reported
*   Investigating
*   Pending Action
*   Resolved
*   Suspended
*   Escalated

---

# Dispute Workflow

*   Opened
*   Assigned
*   Investigating
*   Decision
*   Resolved
