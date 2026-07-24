import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ApiError } from "../api/client";
import { sendChat } from "../api/endpoints";
import type { ChatMessage, ChatResponse } from "../domain";

export interface ChatState {
  messages: ChatMessage[];
  conversationId: number | null; // server-assigned; echoed back next turn
  sending: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  conversationId: null,
  sending: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    messageAppended(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    sendPending(state) {
      state.sending = true;
      state.error = null;
    },
    replyReceived(state, action: PayloadAction<ChatResponse>) {
      state.sending = false;
      state.conversationId = action.payload.conversation_id;
      state.messages.push({
        role: "assistant",
        content: action.payload.reply,
        referenced_items: action.payload.referenced_items ?? [],
      });
    },
    sendError(state, action: PayloadAction<string>) {
      state.sending = false;
      state.error = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const { messageAppended, sendPending, replyReceived, sendError, reset } =
  chatSlice.actions;
export default chatSlice.reducer;

// Minimal shape the thunk needs from the host store
type GetChatState = () => { chat: ChatState };
type Dispatch = (action: unknown) => unknown;

/**
 * Send one turn: optimistically append the user message, call the backend,
 * then append the assistant reply (which carries referenced closet items).
 */
export const sendMessage =
  (message: string) => async (dispatch: Dispatch, getState: GetChatState) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    dispatch(messageAppended({ role: "user", content: trimmed }));
    dispatch(sendPending());

    try {
      const { conversationId } = getState().chat;
      const data = await sendChat(trimmed, conversationId);
      dispatch(replyReceived(data));
    } catch (err) {
      const is502 = err instanceof ApiError && err.status === 502;
      dispatch(
        sendError(
          is502
            ? "The stylist is unavailable right now. Please try again."
            : (err instanceof Error && err.message) || "Something went wrong."
        )
      );
    }
  };
