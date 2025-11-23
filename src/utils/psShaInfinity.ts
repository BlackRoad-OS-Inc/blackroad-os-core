import crypto from "crypto";
import type { JournalEntry } from "../domain/Journal";

/**
 * WARNING: This is a development stub. Do not consider this implementation secure or final.
 * Real PS-SHA∞ semantics will be implemented in a dedicated cryptographic module.
 */

/**
 * PsShaInfinity describes the core operations needed for journaling
 * with PS-SHA∞ semantics: hashing and append-only journaling.
 *
 * Real implementations will likely:
 * - use a specific hash function and encoding
 * - manage per-stream chains of JournalEntries
 * - integrate with storage and RoadChain
 */
export interface PsShaInfinity {
  hash(payload: unknown, previousHash?: string): string;

  /**
   * Append a journal entry.
   * Caller supplies all fields except `hash`; implementation computes the hash.
   */
  journal(entry: Omit<JournalEntry, "hash">): Promise<JournalEntry>;
}

/**
 * Trivial development implementation for PsShaInfinity.
 * NOT cryptographically strong, NOT for production.
 */
export class DevPsShaInfinity implements PsShaInfinity {
  hash(payload: unknown, previousHash?: string): string {
    const hasher = crypto.createHash("sha256");
    const data = JSON.stringify({ payload, previousHash });
    hasher.update(data);
    return hasher.digest("hex");
  }

  async journal(entry: Omit<JournalEntry, "hash">): Promise<JournalEntry> {
    const hash = this.hash(entry, entry.previousHash);
    const fullEntry: JournalEntry = { ...entry, hash };
    // TODO: persist somewhere (DB, file, etc.). For now, just return it.
    return fullEntry;
  }
}
