/**
 * Event represents any event emitted in the system.
 * Recommended naming convention for `type`: domain.action.phase
 * e.g., "task.created", "finance.report.generated".
 */
export interface Event {
  id: string; // unique identifier (could be a ULID or UUID)
  type: string; // e.g. "task.created", "finance.report.generated"
  source: string; // e.g. "blackroad-os-operator", "finance.agent.unified_ledger"
  timestamp: string; // ISO8601
  payload: unknown; // event-specific data
  metadata?: Record<string, unknown>;
}
