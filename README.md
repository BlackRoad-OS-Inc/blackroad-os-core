# blackroad-os-core

`blackroad-os-core` is the **core domain library** for BlackRoad OS. It defines the canonical types and pure helpers used across
the ecosystem (Operator, API, Prism Console, Infra docs) and participates in the shared GitHub project **"BlackRoad OS - Master
Orchestration"**.

## What lives here

- Identity primitives (PS-SHA∞ worldlines and anchors)
- Truth verification pipeline types (`TextSnapshot → VerificationJob → AgentAssessment → TruthState`)
- Domain events, journal entries, and RoadChain block shapes
- Base Agent and Job abstractions with lifecycle helpers
- A minimal `Result` helper for consistent success/error handling

The package is pure TypeScript with no HTTP framework or runtime bindings. It is safe to import from server processes, CLIs, and
browser-friendly bundles alike.

## Installation

```bash
npm install
```

## Usage

Import directly from the barrel to access the stable API:

```ts
import { computePsShaInfinity, Job, startJob, Result } from "blackroad-os-core";
```

## Tests

```bash
npm test
```

## Documentation

See [`docs/CORE_OVERVIEW.md`](docs/CORE_OVERVIEW.md) for module-level context and expected consumers.
