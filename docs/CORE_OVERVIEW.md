# BlackRoad OS Core Overview

`blackroad-os-core` is the canonical domain and primitives library for the wider BlackRoad OS ecosystem. It defines the stable
language shared by Operator, API, Prism Console, Infra docs, and other services participating in the **"BlackRoad OS - Master
Orchestration"** project.

## Module map

- **Results**: Minimal `Result`/`Ok`/`Err` helpers for consistent success/failure handling across packages.
- **Identity**: PS-SHA∞ identity shapes and helpers for computing worldline-style identifiers.
- **Truth**: Types modeling the verification pipeline (`TextSnapshot → VerificationJob → AgentAssessment → TruthState`).
- **Events**: Canonical domain events, journal entries, and RoadChain block shapes for audit-friendly flows.
- **Agents**: Base agent metadata, runtime context, and execution contract.
- **Jobs**: Job lifecycle types plus pure transition helpers.

## Expected consumers

- `blackroad-os-operator`: executes jobs and emits domain events using these primitives.
- `blackroad-os-api`: shapes API responses and ledger payloads from the shared types.
- `blackroad-os-prism-console`: renders events/RoadChain data produced with these schemas (via API).
- `blackroad-os-infra`: references stable type names in operational docs and runbooks.
- `blackroad-os-docs`: describes the concepts surfaced here.

## Design principles

- Pure TypeScript with no framework or transport coupling.
- Stable barrel exports (`src/index.ts`) for consumers.
- Minimal dependencies; favor deterministic pure functions and explicit data shapes.
