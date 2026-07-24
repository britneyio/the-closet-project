import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as endpoints from "../api/endpoints";
import { errorMessage } from "../errors";
import { unwrapList } from "../api/endpoints";
import type { Outfit, OutfitInput } from "../domain";

export interface OutfitsState {
  outfits: Outfit[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OutfitsState = { outfits: [], status: "idle", error: null };

export const fetchOutfits = createAsyncThunk(
  "outfits/fetch",
  async (_: void, { rejectWithValue }) => {
    try {
      return unwrapList(await endpoints.listOutfits());
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const addOutfit = createAsyncThunk(
  "outfits/add",
  async (input: OutfitInput, { rejectWithValue }) => {
    try {
      return await endpoints.createOutfit(input);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const removeOutfit = createAsyncThunk(
  "outfits/remove",
  async (id: number, { rejectWithValue }) => {
    try {
      await endpoints.deleteOutfit(id);
      return id;
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

const slice = createSlice({
  name: "outfits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutfits.pending, (state) => void ((state.status = "loading"), (state.error = null)))
      .addCase(fetchOutfits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.outfits = action.payload;
      })
      .addCase(fetchOutfits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addOutfit.fulfilled, (state, action) => void state.outfits.unshift(action.payload))
      .addCase(removeOutfit.fulfilled, (state, action) => {
        state.outfits = state.outfits.filter((outfit) => outfit.id !== action.payload);
      });
  },
});

export default slice.reducer;
