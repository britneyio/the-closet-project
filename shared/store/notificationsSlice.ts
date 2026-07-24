import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as endpoints from "../api/endpoints";
import { errorMessage } from "../errors";
import { unwrapList } from "../api/endpoints";
import type { AppNotification } from "../domain";

export interface NotificationsState {
  items: AppNotification[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NotificationsState = { items: [], status: "idle", error: null };

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_: void, { rejectWithValue }) => {
    try {
      return unwrapList(await endpoints.listNotifications());
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const markRead = createAsyncThunk(
  "notifications/markRead",
  async (id: number, { rejectWithValue }) => {
    try {
      return await endpoints.markNotificationRead(id, true);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const markAllRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_: void, { rejectWithValue }) => {
    try {
      await endpoints.markAllNotificationsRead();
      return true;
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const selectUnreadCount = (state: { notifications: NotificationsState }) =>
  state.notifications.items.filter((notification) => !notification.read).length;

const slice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => void (state.status = "loading"))
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(markRead.fulfilled, (state, action) => {
        const index = state.items.findIndex((notification) => notification.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items = state.items.map((notification) => ({ ...notification, read: true }));
      });
  },
});

export default slice.reducer;
