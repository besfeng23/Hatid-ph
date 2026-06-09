# 20_AI_GOVERNANCE

**Purpose**

Prevent AI-induced architecture drift.

---

**Authorized AI Roles**

*   ChatGPT
*   Gemini
*   Claude
*   Cursor
*   Copilot
*   Future AI Systems

---

**AI May**

*   Analyze
*   Review
*   Draft
*   Refactor
*   Generate Tests
*   Generate Documentation

---

**AI May Not**

*   Invent Requirements
*   Invent Business Rules
*   Invent Schemas
*   Invent Workflows
*   Invent Permissions
*   Invent Dependencies
*   Invent Security Models

---

**Source Of Truth**

REPOSITORY_CONSTITUTION.md
↓
Decision Log
↓
Founder Decisions
↓
ADRs
↓
Architecture Documents
↓
Code

---

**Traceability Rule**

Every implementation must reference:

Approved architecture document.

---

**Approval Rule**

AI-generated architecture changes require:

*   Decision Review
*   Architecture Review
*   Documentation Update
*   Approval

---

**Security Rule**

AI may never:

*   Bypass RLS
*   Disable Audit Logging
*   Bypass Authentication
*   Introduce Hardcoded Secrets

---

**Finance Rule**

AI may never:

*   Modify Ledger History
*   Delete Financial Records
*   Bypass Reconciliation
*   Alter Settlement Rules

---

**Architecture Rule**

AI must implement architecture.

AI must not create architecture.

Architecture changes require governance approval.
