# blackroad-os-core

`blackroad-os-core` is the base library for BlackRoad OS domain concepts and orchestration primitives. Other services (operator, api, prism console, etc.) import these models instead of redefining them.

## Features

- Canonical domain models: `Agent`, `Capability`, `Task`, `Event`, `JournalEntry`.
- Minimal event bus abstraction with an in-memory `LocalEventBus` for development and testing.
- PS-SHA∞ journaling interface with a development stub (`DevPsShaInfinity`).
- Lightweight config helper for core log level and environment.

## Installation

```bash
npm install
```

## Usage

### Importing domain types

```ts
import { Agent, Task, Event, JournalEntry } from "blackroad-os-core/dist/domain";
```

### Using the local event bus

```ts
import { LocalEventBus } from "blackroad-os-core/dist/bus";
import { Event } from "blackroad-os-core/dist/domain";

const bus = new LocalEventBus();

const handler = (event: Event) => {
  console.log("Received", event.type);
};

bus.subscribe("task.created", handler);
bus.publish({
  id: "evt-1",
  type: "task.created",
  source: "blackroad-os-core.example",
  timestamp: new Date().toISOString(),
  payload: { id: "task-123" },
});
```

### Journaling with the development PS-SHA∞ stub

```ts
import { DevPsShaInfinity } from "blackroad-os-core/dist/utils";

const journal = new DevPsShaInfinity();
const entry = await journal.journal({
  id: "entry-1",
  timestamp: new Date().toISOString(),
  actorId: "agent-1",
  actionType: "demo.started",
  payload: { message: "Hello" },
});

console.log(entry.hash); // sha256 hash over the payload + metadata + previousHash
```

## Configuration

A minimal config helper is provided for this library:

```ts
import { getCoreConfig } from "blackroad-os-core/dist/config";

const config = getCoreConfig();
console.log(config.env, config.logLevel);
```

Higher-level services should layer their own configuration on top of this.

## Tests

```bash
npm test
```

## Documentation

See [`docs/core-architecture.md`](docs/core-architecture.md) for an architectural overview and guidance on how these primitives fit into the broader platform.

## Future Work

- Full PS-SHA∞ implementation with production-grade cryptography.
- Distributed event bus implementations (Kafka, NATS, Redis, etc.).
- Richer schemas and typed payloads for tasks and events.
