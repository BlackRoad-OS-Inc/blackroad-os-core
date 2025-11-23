import type { PsShaInfinity } from "../identity/identityTypes";

export type EventSeverity = "info" | "warning" | "error";

export interface DomainEventPayload {
  [key: string]: unknown;
}

export interface DomainEvent<TPayload extends DomainEventPayload = DomainEventPayload> {
  id: PsShaInfinity;
  occurredAt: string;
  source: string;
  type: string;
  severity: EventSeverity;
  payload: TPayload;
  relatedIds?: PsShaInfinity[];
}
