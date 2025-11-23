import { DevPsShaInfinity } from "../src/utils/psShaInfinity";
import type { JournalEntry } from "../src/domain/Journal";

describe("DevPsShaInfinity", () => {
  const psSha = new DevPsShaInfinity();

  it("produces deterministic hashes for same payload and previousHash", () => {
    const payload = { message: "hello" };
    const previousHash = "prev";

    const hash1 = psSha.hash(payload, previousHash);
    const hash2 = psSha.hash(payload, previousHash);

    expect(hash1).toBe(hash2);
  });

  it("returns journal entries with computed hash", async () => {
    const entryWithoutHash = {
      id: "entry-1",
      timestamp: new Date().toISOString(),
      actorId: "agent-1",
      actionType: "demo.action",
      payload: { value: 1 },
    } satisfies Omit<JournalEntry, "hash">;

    const entry = await psSha.journal(entryWithoutHash);

    expect(entry.hash).toBeDefined();
    expect(entry.hash.length).toBeGreaterThan(0);
    expect(entry).toMatchObject(entryWithoutHash);
  });

  it("changes hash when previousHash changes", async () => {
    const baseEntry = {
      id: "entry-base",
      timestamp: new Date().toISOString(),
      actorId: "agent-1",
      actionType: "chain.action",
      payload: { value: 2 },
    } satisfies Omit<JournalEntry, "hash">;

    const first = await psSha.journal(baseEntry);
    const second = await psSha.journal({ ...baseEntry, id: "entry-2", previousHash: first.hash });
    const third = await psSha.journal({ ...baseEntry, id: "entry-3", previousHash: "different" });

    expect(second.hash).not.toBe(first.hash);
    expect(third.hash).not.toBe(second.hash);
  });
});
