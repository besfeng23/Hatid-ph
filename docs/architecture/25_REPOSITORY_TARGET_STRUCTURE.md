# Hatid Repository Target Structure

Document ID: 25_REPOSITORY_TARGET_STRUCTURE  
Status: Approved  
Scope: Final monorepo layout

## Target Layout

```text
.
├── apps
│   ├── rider
│   ├── driver
│   └── admin
│
├── packages
│   ├── ui
│   ├── types
│   ├── design-tokens
│   ├── config
│   ├── eslint-config
│   └── tsconfig
│
├── supabase
│   ├── migrations
│   ├── tests
│   │   └── pgtap
│   └── functions
│       ├── _shared
│       ├── auth-service
│       ├── workflow-service
│       ├── ledger-service
│       ├── wallet-service
│       ├── payment-service
│       ├── dispatch-service
│       ├── trip-service
│       ├── driver-service
│       ├── compliance-service
│       ├── ops-service
│       └── outbox-processor
│
├── docs
│   ├── architecture
│   ├── adr
│   ├── frontend
│   ├── governance
│   └── runbooks
│
├── .github
│   ├── workflows
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
│
├── package.json
├── turbo.json
├── tsconfig.base.json
├── eslint.config.js
└── README.md
```

## Rules

- Apps consume packages and Edge Function APIs.
- Apps do not import repositories.
- Edge Function handlers are thin wrappers.
- Application services own business logic.
- Repositories own persistence.
- Shared types must not contain mutable finance balances.
- Bounded contexts must not import internals from each other.
- Frontend must follow `21_UI_UX_BASELINE_V1`.
- Firebase code is prohibited after Phase 1 eradication.
