import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as endpoints from "../api/endpoints";
import { errorMessage, hasStatus } from "../errors";
import type { RecommendedOutfit } from "../domain";

export interface RecommendState {
  outfits: RecommendedOutfit[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RecommendState = { outfits: [], status: "idle", error: null };

export const requestOutfits = createAsyncThunk(
  "recommend/request",
  async (
    { query, persist }: { query: string; persist?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const { outfits } = await endpoints.recommend(query, { persist });
      return outfits;
    } catch (err) {
      return rejectWithValue(
        hasStatus(err, 502)
          ? "The stylist is unavailable right now. Please try again."
          : errorMessage(err)
      );
    }
  }
);

const slice = createSlice({
  name: "recommend",
  initialState,
  reducers: {
    clearRecommendations: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOutfits.pending, (state) => void ((state.status = "loading"), (state.error = null)))
      .addCase(requestOutfits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.outfits = action.payload;
      })
      .addCase(requestOutfits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearRecommendations } = slice.actions;
export default slice.reducer;
