import { describe, it, expect, vi, beforeEach } from "vitest";
import reducer, {
  messageAppended,
  sendPending,
  replyReceived,
  sendError,
  reset,
  sendMessage,
  type ChatState,
} from "./chatSlice";
import { ApiError } from "../api/client";

// Mock the network layer so thunk tests are deterministic and offline.
vi.mock("../api/endpoints", () => ({ sendChat: vi.fn() }));
import { sendChat } from "../api/endpoints";

const initial: ChatState = {
  messages: [],
  conversationId: null,
  sending: false,
  error: null,
};

describe("chat reducer", () => {
  it("returns the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initial);
  });

  it("appends a user message optimistically", () => {
    const next = reducer(initial, messageAppended({ role: "user", content: "hi" }));
    expect(next.messages).toEqual([{ role: "user", content: "hi" }]);
  });

  it("marks sending and clears prior error on pending", () => {
    const next = reducer({ ...initial, error: "old" }, sendPending());
    expect(next.sending).toBe(true);
    expect(next.error).toBeNull();
  });

  it("stores conversationId and appends the assistant reply with items", () => {
    const next = reducer(
      { ...initial, sending: true },
      replyReceived({
        reply: "Try the linen shirt.",
        conversation_id: 7,
        referenced_items: [{ id: 1, name: "Linen shirt", cover_file: null }],
      })
    );
    expect(next.sending).toBe(false);
    expect(next.conversationId).toBe(7);
    expect(next.messages.at(-1)).toEqual({
      role: "assistant",
      content: "Try the linen shirt.",
      referenced_items: [{ id: 1, name: "Linen shirt", cover_file: null }],
    });
  });

  it("records an error and stops sending", () => {
    const next = reducer({ ...initial, sending: true }, sendError("boom"));
    expect(next).toMatchObject({ sending: false, error: "boom" });
  });

  it("reset clears everything", () => {
    const dirty: ChatState = {
      messages: [{ role: "user", content: "x" }],
      conversationId: 3,
      sending: true,
      error: "e",
    };
    expect(reducer(dirty, reset())).toEqual(initial);
  });
});

describe("sendMessage thunk", () => {
  beforeEach(() => vi.clearAllMocks());

  const run = async (message: string, state: ChatState = initial) => {
    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({ chat: state });
    await sendMessage(message)(dispatch, getState);
    return dispatched;
  };

  it("ignores blank input (no dispatches)", async () => {
    expect(await run("   ")).toEqual([]);
    expect(sendChat).not.toHaveBeenCalled();
  });

  it("dispatches user turn, pending, then the reply on success", async () => {
    (sendChat as any).mockResolvedValue({
      reply: "Here you go",
      conversation_id: 42,
      referenced_items: [],
    });
    const out = await run("what should I wear?");
    expect(out.map((action) => action.type)).toEqual([
      messageAppended.type,
      sendPending.type,
      replyReceived.type,
    ]);
    expect(sendChat).toHaveBeenCalledWith("what should I wear?", null);
  });

  it("passes the existing conversationId back to the API", async () => {
    (sendChat as any).mockResolvedValue({
      reply: "ok",
      conversation_id: 9,
      referenced_items: [],
    });
    await run("again", { ...initial, conversationId: 9 });
    expect(sendChat).toHaveBeenCalledWith("again", 9);
  });

  it("maps a 502 to the friendly stylist-unavailable message", async () => {
    (sendChat as any).mockRejectedValue(new ApiError("bad gateway", 502, null));
    const out = await run("hi");
    const err = out.find((action) => action.type === sendError.type);
    expect(err.payload).toMatch(/unavailable/i);
  });

  it("surfaces other errors' messages", async () => {
    (sendChat as any).mockRejectedValue(new Error("network down"));
    const out = await run("hi");
    const err = out.find((action) => action.type === sendError.type);
    expect(err.payload).toBe("network down");
  });
});
