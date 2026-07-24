import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as endpoints from "../api/endpoints";
import { errorMessage } from "../errors";
import { clearToken, loadToken, saveToken } from "../session";
import type { User } from "../domain";

type Status = "idle" | "loading" | "authenticated" | "error";

export interface AuthState {
  user: User | null;
  token: string | null;
  status: Status;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

/** Log in, persist the token, and load the current user. */
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { auth_token } = await endpoints.login(email, password);
      await saveToken(auth_token);
      const user = await endpoints.currentUser();
      return { token: auth_token, user };
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

/** Register, then immediately log in. */
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    { email, username, password }: { email: string; username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await endpoints.register(email, username, password);
      const { auth_token } = await endpoints.login(email, password);
      await saveToken(auth_token);
      const user = await endpoints.currentUser();
      return { token: auth_token, user };
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

/** On app start, restore the session. Web authenticates via the httpOnly cookie
    and stores no token, so we can't gate on a token — always ask the server who
    we are; the cookie (web) or bearer token (mobile) authenticates the call. A
    401 just means "not signed in". */
export const bootstrapAuth = createAsyncThunk("auth/bootstrap", async () => {
  const token = await loadToken();
  try {
    const user = await endpoints.currentUser();
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await endpoints.logout();
  } finally {
    await clearToken();
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous auth reset. Used after account deletion, where the server
    // session is already gone so the logout thunk's API call would fail — we
    // just need to clear client state immediately.
    signedOut: () => initialState,
  },
  extraReducers: (builder) => {
    const authenticated = (
      state: AuthState,
      action: { payload: { token: string | null; user: User | null } }
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      // Authenticated is determined by having a user, not a token: on web the
      // session lives in the httpOnly cookie and no token is ever stored.
      state.status = action.payload.user ? "authenticated" : "idle";
      state.error = null;
    };

    builder
      .addCase(login.pending, (state) => void ((state.status = "loading"), (state.error = null)))
      .addCase(login.fulfilled, authenticated)
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.error = (action.payload as string) ?? "Login failed.";
      })
      .addCase(signup.pending, (state) => void ((state.status = "loading"), (state.error = null)))
      .addCase(signup.fulfilled, authenticated)
      .addCase(signup.rejected, (state, action) => {
        state.status = "error";
        state.error = (action.payload as string) ?? "Sign up failed.";
      })
      .addCase(bootstrapAuth.fulfilled, authenticated)
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const { signedOut } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.status === "authenticated";
export default authSlice.reducer;
