import type { PsShaInfinity } from "../identity/identityTypes";

export interface RoadChainBlock {
  height: number;
  hash: string;
  prevHash: string;
  timestamp: string;
  journalEntryIds: PsShaInfinity[];
}
