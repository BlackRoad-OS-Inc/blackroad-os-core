import type { PsShaInfinity } from "../identity/identityTypes";

export interface JournalEntry {
  id: PsShaInfinity;
  eventId: PsShaInfinity;
  sequence: number;
  createdAt: string;
  prevEntryHash?: string;
  entryHash: string;
}
