# blackroad-os-core Architecture

`blackroad-os-core` provides the core domain primitives and infrastructure abstractions that the rest of BlackRoad OS builds upon. It is intentionally free of UI concerns and runtime-specific integrations so that services like `blackroad-os-operator`, `blackroad-os-api`, and `blackroad-os-prism-console` can import and reuse the same building blocks.

## Domain Models

- **Agent**: Logical actor (human or AI) that performs work. See [`src/domain/Agent.ts`](../src/domain/Agent.ts).
- **Capability**: Declarative description of an action an agent can perform, such as `finance.runClose` or `infra.deployService`. See [`src/domain/Capability.ts`](../src/domain/Capability.ts).
- **Task**: Unit of work to be executed, with lifecycle metadata and payloads. See [`src/domain/Task.ts`](../src/domain/Task.ts).
- **Event**: Notification emitted by any part of the system. Event types follow `domain.action.phase` naming like `task.created` or `finance.report.generated`. See [`src/domain/Event.ts`](../src/domain/Event.ts).
- **JournalEntry**: Append-only record compatible with PS-SHA∞ semantics, enabling tamper-evident audit trails. See [`src/domain/Journal.ts`](../src/domain/Journal.ts).

## Event Bus Abstraction

The `EventBus` interface defines a minimal publish/subscribe contract for domain events. The provided [`LocalEventBus`](../src/bus/EventBus.ts) is an in-memory implementation useful for local development and testing. Future distributed implementations (Kafka, NATS, Redis, etc.) can implement the same interface to integrate across processes.

## PS-SHA∞ Journaling Stub

`PsShaInfinity` describes hashing and journaling capabilities needed for PS-SHA∞. [`DevPsShaInfinity`](../src/utils/psShaInfinity.ts) offers a trivial implementation for prototypes—it is **not** production-ready or cryptographically strong. The journal operation computes a hash over each entry (including any `previousHash`) to support chained, tamper-evident logs.

## Example Flow

1. A new Task (e.g., `finance.close`) is created and emits a `task.created` Event.
2. Agents subscribed via the `EventBus` pick up the event and process the task.
3. Each significant action appends a `JournalEntry` through `PsShaInfinity` to provide an auditable trail.

These primitives keep the domain layer consistent across services while leaving room for richer schemas, storage integrations, and cryptographic rigor in future iterations.
