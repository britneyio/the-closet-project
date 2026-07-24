// Auth-token session, platform-neutral. The host app injects a storage backend
// (web: localStorage; RN: AsyncStorage). All access is async so the same code
// works for both (localStorage is sync but awaiting a value is harmless).

export interface Storage {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
}

const TOKEN_KEY = "token";

// In-memory fallback so imports never crash before configureStorage runs.
const memory = new Map<string, string>();
let storage: Storage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => void memory.set(key, value),
  removeItem: (key) => void memory.delete(key),
};

export function configureStorage(next: Storage): void {
  storage = next;
}

export const loadToken = async (): Promise<string | null> =>
  (await storage.getItem(TOKEN_KEY)) ?? null;
export const saveToken = async (token: string): Promise<void> => {
  await storage.setItem(TOKEN_KEY, token);
};
export const clearToken = async (): Promise<void> => {
  await storage.removeItem(TOKEN_KEY);
};
