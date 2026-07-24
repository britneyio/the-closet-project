import { configureStore } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { reducers } from "shared/store/rootReducer";
import { configureApi } from "shared/api/client";
import { configureStorage } from "shared/session";

// Same shared reducer map as the web app — the store shape is identical across
// platforms. Only the platform bindings differ:
//  - base URL comes from the Expo config;
//  - the auth token is sent as an Authorization header (no cookie on native)
//    and stored in the OS secure enclave via expo-secure-store (Keychain /
//    Keystore) rather than plaintext AsyncStorage.
const apiBaseUrl =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? "http://127.0.0.1:8000";

configureApi({ baseURL: apiBaseUrl, credentials: "omit" });
configureStorage({
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
});

export const store = configureStore({ reducer: reducers });
