# 11_SECURITY_ARCHITECTURE

**Source Decisions**

*   FD-401
*   FD-701
*   FD-702

**Dependencies**

*   08_PERMISSION_MATRIX.md
*   10_DATABASE_ARCHITECTURE.md

---

**Security Principles**

*   Zero Trust
*   Least Privilege
*   Defense in Depth
*   Audit First
*   RLS First

---

**Authentication**

*   **Provider:** Supabase Auth
*   **Methods:**
    *   Email OTP
    *   Password
    *   Future MFA
    *   Future Passkeys

---

**Session Management**

*   JWT
*   Short-lived access tokens
*   Rotating refresh tokens

---

**Authorization**

*   **Model:**
    *   RBAC
    *   RLS
*   **Roles:**
    *   Rider
    *   Driver
    *   Support Agent
    *   Operator
    *   Compliance Officer
    *   Finance Officer
    *   Administrator
    *   Super Administrator

---

**RLS Strategy**

*   Every table protected.
*   Policies permission-based.
*   No direct table exposure.

---

**Secrets Management**

*   Never store secrets in source code.
*   **Environment Variables:** Server only.

---

**Data Encryption**

*   **In Transit:** TLS
*   **At Rest:**
    *   Database Encryption
    *   Storage Encryption

---

**Audit Logging**

*   Authentication Events
*   Authorization Events
*   Financial Events
*   Compliance Events
*   Administrative Actions

---

**Security Monitoring**

*   Failed Logins
*   Suspicious Activity
*   Payout Anomalies
*   Identity Abuse
*   Geo Anomalies

---

**Incident Response**

1.  Detection
2.  Investigation
3.  Containment
4.  Resolution
5.  Postmortem

---

**Compliance Controls**

*   Identity Verification
*   Document Validation
*   Fraud Monitoring
*   Device Monitoring
*   Risk Scoring

---

**Administrative Controls**

*   No shared accounts.
*   No hardcoded credentials.
*   All admin actions audited.
*   No bypass mechanisms.
