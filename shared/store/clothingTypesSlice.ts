import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as endpoints from "../api/endpoints";
import { errorMessage } from "../errors";
import { unwrapList } from "../api/endpoints";
import type { ClothingType } from "../domain";

export interface ClothingTypesState {
  types: ClothingType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ClothingTypesState = { types: [], status: "idle", error: null };

export const fetchTypes = createAsyncThunk("types/fetch", async (_: void, { rejectWithValue }) => {
  try {
    return unwrapList(await endpoints.listTypes());
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const addType = createAsyncThunk("types/add", async (name: string, { rejectWithValue }) => {
  try {
    return await endpoints.createType(name);
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const renameType = createAsyncThunk(
  "types/rename",
  async ({ id, name }: { id: number; name: string }, { rejectWithValue }) => {
    try {
      return await endpoints.updateType(id, name);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const removeType = createAsyncThunk(
  "types/remove",
  async (id: number, { rejectWithValue }) => {
    try {
      await endpoints.deleteType(id);
      return id;
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

const slice = createSlice({
  name: "clothingTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypes.pending, (state) => void (state.status = "loading"))
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.types = action.payload;
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addType.fulfilled, (state, action) => void state.types.push(action.payload))
      .addCase(renameType.fulfilled, (state, action) => {
        const index = state.types.findIndex((type) => type.id === action.payload.id);
        if (index !== -1) state.types[index] = action.payload;
      })
      .addCase(removeType.fulfilled, (state, action) => {
        state.types = state.types.filter((type) => type.id !== action.payload);
      });
  },
});

export default slice.reducer;
