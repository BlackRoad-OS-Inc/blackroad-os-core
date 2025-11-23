import type { Event } from "../domain/Event";

export type EventHandler = (event: Event) => Promise<void> | void;

/**
 * EventBus is a simple abstraction over pub/sub for domain events.
 * Implementations can be in-memory, process-local buses or distributed
 * (Kafka, NATS, Redis, etc.).
 */
export interface EventBus {
  publish(event: Event): Promise<void>;
  subscribe(eventType: string, handler: EventHandler): void;
  unsubscribe(eventType: string, handler: EventHandler): void;
}

/**
 * LocalEventBus is an in-memory implementation of the EventBus interface.
 * It is intended for local development and testing scenarios.
 * Distributed implementations (Kafka, NATS, etc.) should implement the same interface.
 */
export class LocalEventBus implements EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  async publish(event: Event): Promise<void> {
    const handlers = this.handlers.get(event.type);
    if (!handlers || handlers.size === 0) return;

    for (const handler of handlers) {
      await Promise.resolve(handler(event));
    }
  }

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }

  unsubscribe(eventType: string, handler: EventHandler): void {
    const set = this.handlers.get(eventType);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) {
      this.handlers.delete(eventType);
    }
  }
}
