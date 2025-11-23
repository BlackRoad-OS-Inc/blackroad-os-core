export type PsShaInfinity = string;

export type IdentityKind =
  | "agent"
  | "job"
  | "task"
  | "text_snapshot"
  | "event"
  | "ledger_block"
  | "user"
  | "system";

export interface IdentityAnchor {
  id: PsShaInfinity;
  kind: IdentityKind;
  createdAt: string;
  label?: string;
  tags?: string[];
}
