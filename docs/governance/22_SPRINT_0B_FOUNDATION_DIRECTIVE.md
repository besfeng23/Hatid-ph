# Hatid Sprint 0B Foundation Directive

Document ID: 22_SPRINT_0B_FOUNDATION_DIRECTIVE  
Status: Mandatory before feature implementation  
Scope: Repository structure, governance, CI/CD, linting, type boundaries, baseline enforcement

## Purpose

Sprint 0B establishes repository enforcement before product code expands.

This phase exists because early generated foundation files drifted from the frozen architecture.

## Sprint 0B Objectives

Create:

- repository structure
- CODEOWNERS
- PR template
- GitHub Actions quality gates
- enterprise ESLint config
- Turborepo v2 config
- TypeScript strict base config
- architecture boundary rules
- organization-first shared types
- workflow shared types
- ledger shared types
- design token package
- Firebase eradication readiness

## Required Structure

```text
/apps
  /rider
  /driver
  /admin

/packages
  /ui
  /types
  /config
  /eslint-config
  /tsconfig
  /design-tokens

/supabase
  /migrations
  /functions
    /_shared
    /auth-service
    /workflow-service
    /ledger-service
    /dispatch-service

/docs
  /architecture
  /adr
  /frontend
  /governance
  /runbooks

/.github
  /workflows
  CODEOWNERS
  PULL_REQUEST_TEMPLATE.md
```

## Prohibited in Sprint 0B

Do not build:

- dispatch features
- wallet UI
- trip request UI
- driver screens
- admin screens
- payment integration
- production business logic

Sprint 0B is governance and foundation only.

## Type Rules

Shared types must reflect frozen architecture.

Required type groups:

- `core.types.ts`
- `organization.types.ts`
- `member.types.ts`
- `iam.types.ts`
- `workflow.types.ts`
- `finance.account.types.ts`
- `finance.journal.types.ts`
- `finance.ledger-line.types.ts`
- `dispatch.types.ts`
- `audit.types.ts`
- `event.types.ts`

## Finance Type Rule

Forbidden type shape:

```ts
WalletBalance {
  amount: number
}
```

Required:

```ts
WalletBalanceProjection {
  calculatedBalance: number
  asOfTimestamp: string
}
```

Source of truth remains ledger lines.

## Workflow Type Rule

Trips must not own lifecycle state directly.

Required:

- `workflowInstanceId`
- state read through workflow service/projection

## Import Boundary Rules

Prevent:

- dispatch importing finance internals
- finance importing dispatch internals
- frontend importing database repositories directly
- workflow importing app-specific UI code
- packages/types importing apps
- service handlers bypassing application service layer

## Acceptance Criteria

Sprint 0B is accepted when:

- repo structure exists
- CODEOWNERS exists
- PR template exists
- quality gates workflow exists
- lint/typecheck/test workflow exists
- no Firebase dependency remains in app code
- TypeScript strict mode enabled
- no `any`
- no `ts-ignore`
- architecture compliance checklist committed
- UI baseline committed
