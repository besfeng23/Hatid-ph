# Safety and Incident Response

## Rule

Safety is not a UI button. It is an operational workflow with evidence, escalation, access controls, and audit logs.

## MVP safety features

- SOS button during active trip
- emergency contacts
- trip sharing link/token
- incident report form
- rider/driver blocking
- basic admin safety queue
- audit trail for all safety actions

## Later safety features

- masked calls/messages
- pickup PIN/OTP
- route deviation alerts
- abnormal stop detection
- crash/accident report workflow
- emergency-service escalation playbooks
- safety risk scoring with human review

## SOS event flow

1. User taps SOS.
2. `safety-service` creates `sos_event`.
3. Capture trip ID, actor, location snapshot, timestamp, device/session metadata.
4. Notify safety/admin queue.
5. Notify emergency contacts if configured and user policy allows.
6. Freeze relevant trip evidence.
7. Open linked support/safety case.
8. Require closure reason and reviewer.

## Incident report categories

- accident
- harassment
- unsafe driving
- wrong vehicle/driver
- route deviation
- lost item
- payment dispute related to safety
- vehicle issue
- delivery damage/loss
- other

## Privacy and access

Safety data is restricted. Ordinary support staff must not have unrestricted access to SOS details, government IDs, live location history, or sensitive incident narratives.

## Evidence handling

Evidence can include:

- trip events
- route/location snapshots
- chat/call metadata
- uploaded photos/files
- driver/rider statements
- admin notes

Evidence must be immutable or versioned after submission.

## Admin safety actions

- view safety queue
- contact rider/driver
- escalate internally
- mark temporary account hold
- block future matching between parties
- request documents/evidence
- close incident with reason

All actions require audit logs.

## What not to do

- Do not let AI close safety incidents.
- Do not silently suspend users without human review and audit trail.
- Do not expose live location broadly to admins.
- Do not treat SOS as a support ticket only.
