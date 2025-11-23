export interface CapabilityIdBrand {
  readonly __brand: "CapabilityId";
}

export type CapabilityId = string & CapabilityIdBrand;

/**
 * Capability describes an action or service an Agent can perform.
 * Examples include "finance.runClose", "infra.deployService", or
 * "orchestration.plan".
 */
export interface Capability {
  id: CapabilityId;
  name: string;
  description?: string;

  /**
   * Optional JSON schema (or other declarative structure) for inputs.
   * This is not enforced here; it's primarily for documentation and validation
   * by higher-level services.
   */
  inputSchema?: unknown;

  /**
   * Optional JSON schema for outputs.
   */
  outputSchema?: unknown;

  /**
   * Optional metadata, e.g. tags, versioning, or domain (finance, infra, etc.).
   */
  metadata?: Record<string, unknown>;
}
