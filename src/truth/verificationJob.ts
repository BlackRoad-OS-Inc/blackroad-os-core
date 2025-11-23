import type { PsShaInfinity } from "../identity/identityTypes";

export type VerificationKind =
  | "factual_consistency"
  | "policy_compliance"
  | "safety"
  | "classification"
  | "custom";

export type VerificationStatus = "pending" | "running" | "completed" | "failed";

export interface VerificationJob {
  id: PsShaInfinity;
  createdAt: string;
  snapshotId: PsShaInfinity;
  kind: VerificationKind;
  status: VerificationStatus;
  requestedBy: string;
  parameters?: Record<string, unknown>;
  ledgerTxId?: string;
}
