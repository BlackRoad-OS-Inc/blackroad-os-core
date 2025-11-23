import type { AgentId } from "./Agent";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "cancelled";

/**
 * Task represents a unit of work to be executed by one or more agents.
 */
export interface Task {
  id: string; // unique runtime identifier
  type: string; // e.g. "finance.close", "infra.deploy"
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  status: TaskStatus;

  /**
   * Domain-specific payload describing the work.
   * Higher layers should provide typed wrappers around this.
   */
  payload: unknown;

  /**
   * Optional result when the task is completed.
   */
  result?: unknown;

  /**
   * Optional error when the task is failed.
   */
  error?: string | unknown;

  /**
   * Agent currently assigned to this task (if any).
   */
  assignedAgentId?: AgentId;

  /**
   * Optional metadata for correlation (e.g. correlationId, traceId).
   */
  metadata?: Record<string, unknown>;
}
