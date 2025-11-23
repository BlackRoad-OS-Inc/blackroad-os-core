/**
 * JournalEntry represents a single append-only log record.
 * It is designed to be compatible with PS-SHA∞ semantics:
 * - each entry can refer to the previous hash
 * - the hash is computed over payload + metadata + previousHash
 */
export interface JournalEntry {
  id: string; // unique identifier for the entry
  timestamp: string; // ISO8601
  actorId: string; // who/what performed the action (agent ID or human ID)
  actionType: string; // domain-specific action type (e.g. "finance.close.started")
  payload: unknown; // contextual information

  /**
   * Hash of the previous JournalEntry in the same chain/stream.
   * This supports a chained, tamper-evident log.
   */
  previousHash?: string;

  /**
   * Hash of this entry's content (including previousHash).
   * The exact hashing algorithm is provided by psShaInfinity utils.
   */
  hash: string;

  metadata?: Record<string, unknown>;
}
