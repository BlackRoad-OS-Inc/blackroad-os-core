import type { CapabilityId } from "./Capability";

export interface AgentIdBrand {
  readonly __brand: "AgentId";
}

export type AgentId = string & AgentIdBrand;

/**
 * Agent is a logical actor in BlackRoad OS, which can be human-operated or AI-driven.
 * It represents intent and capability, not a specific runtime process.
 */
export interface Agent {
  id: AgentId;
  name: string;
  description?: string;

  /**
   * List of capabilities this agent claims to support.
   * These are capability IDs defined in Capability.ts.
   */
  capabilities: CapabilityId[];

  /**
   * Arbitrary metadata, such as:
   * - agent type (finance, infra, orchestration, etc.)
   * - version / build info
   * - owner (e.g., "operator", "external")
   */
  metadata?: Record<string, unknown>;
}
