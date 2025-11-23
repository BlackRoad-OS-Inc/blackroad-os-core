import { LocalEventBus } from "../src/bus/EventBus";
import type { Event } from "../src/domain/Event";

describe("LocalEventBus", () => {
  it("invokes subscribed handler when event is published", async () => {
    const bus = new LocalEventBus();
    const handler = jest.fn();
    const event: Event = {
      id: "evt-1",
      type: "test.event",
      source: "test",
      timestamp: new Date().toISOString(),
      payload: { value: 1 },
    };

    bus.subscribe("test.event", handler);
    await bus.publish(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  it("does not invoke handler after unsubscribe", async () => {
    const bus = new LocalEventBus();
    const handler = jest.fn();
    const event: Event = {
      id: "evt-2",
      type: "test.event",
      source: "test",
      timestamp: new Date().toISOString(),
      payload: { value: 2 },
    };

    bus.subscribe("test.event", handler);
    bus.unsubscribe("test.event", handler);
    await bus.publish(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it("handles publish with no registered handlers", async () => {
    const bus = new LocalEventBus();
    const event: Event = {
      id: "evt-3",
      type: "unhandled.event",
      source: "test",
      timestamp: new Date().toISOString(),
      payload: { value: 3 },
    };

    await expect(bus.publish(event)).resolves.toBeUndefined();
  });
});
