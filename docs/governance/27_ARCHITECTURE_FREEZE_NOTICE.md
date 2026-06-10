# Hatid Architecture Freeze Notice

Document ID: 27_ARCHITECTURE_FREEZE_NOTICE  
Status: Frozen  
Scope: Architecture authority and implementation sequencing

## Freeze Declaration

Hatid's Supabase-first architecture is frozen. The active architecture authority is indexed in [`../README.md`](../README.md), led by Architecture Baseline V1, the approved ADRs, and the Final Architecture Governance Audit.

Firebase is prohibited. Legacy hybrid and Firebase-oriented documents are superseded and are preserved only for historical reference under `docs/legacy/`.

## Implementation Restriction

Implementation must not begin from, rely on, or cite a superseded document as architecture authority. If historical guidance conflicts with the active authority, the active authority wins.

Any proposed architecture change requires an approved ADR before implementation. Architecture changes must not be introduced indirectly through code, migrations, dependencies, infrastructure configuration, or AI-generated work.

## Codex and AI Requirement

All Codex and other AI-assisted work must read the active architecture list in `docs/README.md` before planning or changing the repository. AI tools must not infer a new architecture by combining active and superseded documents.

## Approved Next Phase

Sprint 0B, as defined in `docs/governance/22_SPRINT_0B_FOUNDATION_DIRECTIVE.md`, is the only approved next implementation phase.

This freeze notice does not mark Sprint 0B complete. Completion requires the actual repository structure, tooling, quality gates, and governance evidence required by the Sprint 0B directive.
