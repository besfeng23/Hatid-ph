# 08_PERMISSION_MATRIX

## Source Decisions

FD-201
FD-202
FD-302
FD-401

---

# Rider

**Permissions:**

*   Create Booking
*   View Own Trips
*   Manage Profile
*   Submit Complaints

**Restrictions:**

*   Cannot access driver data
*   Cannot access finance data

---

# Driver

**Permissions:**

*   Accept Trips
*   Manage Profile
*   Manage Vehicle
*   Request Payout

**Restrictions:**

*   Cannot approve payouts
*   Cannot approve drivers

---

# Support Agent

**Permissions:**

*   View Cases
*   Create Cases
*   Resolve Cases

**Restrictions:**

*   Cannot alter finances

---

# Operator

**Permissions:**

*   Approve Drivers
*   Approve Vehicles
*   Monitor Trips

**Restrictions:**

*   Cannot access ledger controls

---

# Compliance Officer

**Permissions:**

*   Investigate Cases
*   Suspend Accounts
*   Verify Documents

**Restrictions:**

*   Cannot modify financial balances

---

# Finance Officer

**Permissions:**

*   Review Payouts
*   Manage Settlements
*   View Finance Reports

**Restrictions:**

*   Cannot modify compliance records

---

# Administrator

**Permissions:**

*   Full Operations Access

**Restrictions:**

*   Cannot bypass audit logging

---

# Super Administrator

**Permissions:**

*   Platform Governance
*   Emergency Controls

**Restrictions:**

*   All actions audited
