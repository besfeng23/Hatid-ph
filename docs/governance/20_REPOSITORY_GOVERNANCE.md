# Hatid Repository & Source Code Governance

Document ID: 20_REPOSITORY_GOVERNANCE  
Status: Approved for Implementation  
Scope: GitHub branch protection, CODEOWNERS, release management, migrations, emergency protocol, production access, AI governance

## Branch Protection

`main` is locked.

Rules:

- Pull request required.
- Minimum 2 approvals.
- Code owner review required.
- Stale approvals dismissed on new commits.
- Required status checks must pass.
- Linear history required.
- Squash merge only.
- Direct pushes disabled.
- Force push disabled.

## CODEOWNERS

Every bounded context and app must have owners.

A PR touching a directory cannot merge without owner approval.

## ADR Workflow

Architectural changes require ADR.

Process:

1. Draft ADR in `docs/adr/`.
2. Open PR with `architecture-review` label.
3. Principal architect review.
4. Domain owner review.
5. Merge.
6. Engineering implementation may begin.

## Database Migration Approval

Migrations are high risk.

Any PR touching `/supabase/migrations/*.sql` requires data architect review.

Reviewer must verify:

- expand-contract safety
- no destructive change in same deployment
- RLS policies present
- pgTAP tests included
- indexes and constraints reviewed
- roll-forward strategy documented

## Release and Tagging

Semantic versioning:

- `vMAJOR.MINOR.PATCH`

Production deployment is triggered by release tag only.

PR titles must use conventional commits:

- `feat(dispatch): add offer TTL`
- `fix(ledger): correct reversal posting`
- `chore(repo): update CODEOWNERS`

## Emergency Hotfix

During SEV-1:

- hotfix branch from main
- CTO or principal architect may authorize expedited review
- CI checks still run
- postmortem required within 48 hours
- skipped tests or ADRs must be backfilled

## Rollback

Frontend/application rollback:

- GitHub Revert PR
- deploy as forward-moving change

Database rollback:

- down migrations are prohibited in production
- all DB fixes roll forward through new migration

## Production Access Governance

No permanent production DB credentials.

Production access must be:

- time-bound
- approved
- logged
- MFA-protected
- tied to individual user

Shared accounts are forbidden.

Emergency access requires:

1. Active SEV-1.
2. CTO, principal architect, or SRE lead approval.
3. Audit log.
4. Post-incident review.

## Service Ownership

Each service directory must include:

- OWNER
- DOMAIN
- CRITICALITY
- RUNBOOK
- SLO_REFERENCE

Owners are responsible for availability, security, dependency upgrades, incidents, docs, and runbooks.

## Security Review Required

Mandatory security review for:

- JWT changes
- MFA/session/auth changes
- RLS policy changes
- RBAC changes
- organization isolation changes
- ledger/payment logic
- DSAR/LER export logic
- AML rules
- secret handling

## AI-Assisted Development

AI-generated code is allowed but never trusted automatically.

PR must disclose:

- AI Assisted: Yes/No
- Tool used
- Scope generated
- Validation performed

AI may not:

- ignore architecture
- introduce undocumented dependencies
- modify financial controls without review
- modify security controls without review
- modify migrations without review

## Production Readiness Gate

Before production:

- compliance checklist passes
- quality gates pass
- security review complete
- domain owner approval complete
- observability verified
- runbook exists
- roll-forward procedure documented
- feature flag configured

## Repository Freeze Protocol

Protected directories:

- `/docs/architecture/`
- `/docs/adr/`
- `/supabase/migrations/`

Changes require approved ADR, architecture review, and principal architect approval.

Exception only for SEV-1, followed by postmortem and backfill.
