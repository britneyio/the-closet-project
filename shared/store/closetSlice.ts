import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as endpoints from "../api/endpoints";
import { errorMessage } from "../errors";
import type { ClothingItem, ClothingItemInput } from "../domain";

type Status = "idle" | "loading" | "succeeded" | "failed";

export interface ClosetState {
  items: ClothingItem[];
  count: number;
  status: Status;
  error: string | null;
}

const initialState: ClosetState = { items: [], count: 0, status: "idle", error: null };


export const fetchClothing = createAsyncThunk(
  "closet/fetch",
  async (page: number | undefined, { rejectWithValue }) => {
    try {
      return await endpoints.listClothing(page ?? 1);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const addItem = createAsyncThunk(
  "closet/add",
  async (input: ClothingItemInput, { rejectWithValue }) => {
    try {
      return await endpoints.createClothing(input);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const updateItem = createAsyncThunk(
  "closet/update",
  async ({ id, input }: { id: number; input: Partial<ClothingItemInput> }, { rejectWithValue }) => {
    try {
      return await endpoints.updateClothing(id, input);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const removeItem = createAsyncThunk(
  "closet/remove",
  async (id: number, { rejectWithValue }) => {
    try {
      await endpoints.deleteClothing(id);
      return id;
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

const closetSlice = createSlice({
  name: "closet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClothing.pending, (state) => void ((state.status = "loading"), (state.error = null)))
      .addCase(fetchClothing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(fetchClothing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.count += 1;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.count = Math.max(0, state.count - 1);
      });
  },
});

export default closetSlice.reducer;
