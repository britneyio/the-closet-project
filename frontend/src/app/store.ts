import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "shared/store/rootReducer";
import { configureApi } from "shared/api/client";
import { configureStorage } from "shared/session";

// Same-origin by default: the Vite dev proxy (and same-domain prod hosting)
// forward /api to the backend, which lets the httpOnly auth cookie work without
// CORS. Override with VITE_API_BASE_URL only for a cross-origin backend.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
configureApi({ baseURL: API_BASE, credentials: "include" });

// Auth is carried by an httpOnly cookie the browser manages and JS cannot read
// (XSS-resistant), so the web app stores NO token itself — the session token
// getter always returns null. Non-auth state may still use localStorage.
configureStorage({
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
});

export const store = configureStore({ reducer: reducers });
export type AppStore = typeof store;
