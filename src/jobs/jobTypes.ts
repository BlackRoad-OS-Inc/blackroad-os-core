import type { PsShaInfinity } from "../identity/identityTypes";

export type JobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export interface Job<Input = unknown, Output = unknown> {
  id: PsShaInfinity;
  createdAt: string;
  updatedAt: string;
  type: string;
  status: JobStatus;
  input: Input;
  output?: Output;
  errorMessage?: string;
  agentId?: PsShaInfinity;
}
