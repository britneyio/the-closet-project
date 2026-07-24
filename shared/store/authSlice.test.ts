import { describe, it, expect } from "vitest";
import reducer, { login, logout, bootstrapAuth, type AuthState } from "./authSlice";
import type { User } from "../domain";

const user: User = { id: 1, username: "alice", email: "alice@example.com" };
const initial: AuthState = { user: null, token: null, status: "idle", error: null };

describe("auth reducer", () => {
  it("is unauthenticated initially", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initial);
  });

  it("becomes authenticated on login success", () => {
    const next = reducer(initial, login.fulfilled({ token: "tok", user }, "rid", { email: "a", password: "b" }));
    expect(next.status).toBe("authenticated");
    expect(next.token).toBe("tok");
    expect(next.user).toEqual(user);
  });

  it("captures a login error message", () => {
    const next = reducer(initial, {
      type: login.rejected.type,
      payload: "Invalid credentials",
    });
    expect(next.status).toBe("error");
    expect(next.error).toBe("Invalid credentials");
  });

  it("stays idle when bootstrap finds no token", () => {
    const next = reducer(initial, bootstrapAuth.fulfilled({ token: null, user: null }, "rid"));
    expect(next.status).toBe("idle");
  });

  it("clears everything on logout", () => {
    const authed: AuthState = { user, token: "tok", status: "authenticated", error: null };
    expect(reducer(authed, logout.fulfilled(undefined, "rid"))).toEqual(initial);
  });
});
