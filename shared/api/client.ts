// Platform-neutral HTTP client. Uses `fetch` (present on both web and React
// Native) rather than axios, which is only configured on web. The host app
// calls `configureApi` once at startup to inject its base URL and a token
// getter — web reads localStorage, RN reads AsyncStorage.

import { loadToken } from "../session";

type TokenGetter = () => string | null | Promise<string | null>;

interface ApiConfig {
  baseURL: string;
  /** Sync (web localStorage) or async (RN AsyncStorage); always awaited.
   * Defaults to the shared session token. On web this returns null — auth
   * rides an httpOnly cookie the browser attaches automatically. */
  getToken: TokenGetter;
  /** "include" on web so the httpOnly auth cookie is sent; "omit" on RN. */
  credentials: RequestCredentials;
}

let config: ApiConfig = {
  baseURL: "http://127.0.0.1:8000",
  getToken: loadToken,
  credentials: "omit",
};

export function configureApi(next: Partial<ApiConfig>): void {
  config = { ...config, ...next };
}

/** The error envelope Django REST Framework returns on a 4xx/5xx. */
export interface ApiErrorBody {
  detail?: string;
  non_field_errors?: string[];
  // DRF also returns per-field arrays (e.g. { email: ["..."] }); captured loosely
  // but typed as string arrays so callers can read field messages safely.
  [field: string]: string | string[] | undefined;
}

/** Raised for any non-2xx response. `status` lets callers branch (e.g. 502). */
export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;
  constructor(message: string, status: number, body: ApiErrorBody | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type Method = "GET" | "POST" | "PATCH" | "DELETE";

const UNSAFE: ReadonlySet<Method> = new Set(["POST", "PATCH", "DELETE"]);

// Django's CSRF cookie is readable JS (not httpOnly) by design — the double
// submit pattern. We echo it back in X-CSRFToken on state-changing requests.
// Only present on web (there is no `document` in React Native).
function csrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** Turn a snake_case field name into a readable label ("email" -> "Email"). */
function humanizeField(field: string): string {
  const label = field.replace(/_/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function friendlyMessage(body: ApiErrorBody | null, status: number): string {
  if (!body) return `Request failed (${status})`;
  if (body.detail) return body.detail;
  if (body.non_field_errors?.length) return body.non_field_errors[0];
  // DRF field validation errors arrive as { fieldName: ["message", ...] }
  // (e.g. { password: ["This password is too short."] }). Surface the first
  // concrete message, labelled by field, so the user knows exactly what to fix.
  for (const [field, value] of Object.entries(body)) {
    const message = Array.isArray(value) ? value[0] : value;
    if (typeof message === "string" && message) return `${humanizeField(field)}: ${message}`;
  }
  return `Request failed (${status})`;
}

// Single point where the network boundary is crossed. `Response` is defined
// data; the JSON body's concrete shape is declared by each endpoint via the
// `Result` type parameter (e.g. api.get<User>) rather than `any`.
async function handle<Result>(res: Response): Promise<Result> {
  const text = await res.text();
  if (!res.ok) {
    const body: ApiErrorBody | null = text ? (JSON.parse(text) as ApiErrorBody) : null;
    throw new ApiError(friendlyMessage(body, res.status), res.status, body);
  }
  return (text ? JSON.parse(text) : null) as Result;
}

async function authHeaders(method: Method, json: boolean): Promise<Record<string, string>> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (json) headers["Content-Type"] = "application/json";
  // Mobile: bearer token from SecureStore. Web: getToken returns null and the
  // httpOnly cookie authenticates instead.
  const token = await config.getToken();
  if (token) headers.Authorization = `Token ${token}`;
  // CSRF (web cookie auth): echo the csrftoken cookie on state-changing requests.
  if (UNSAFE.has(method)) {
    const csrf = csrfToken();
    if (csrf) headers["X-CSRFToken"] = csrf;
  }
  return headers;
}

async function request<Result>(method: Method, path: string, body?: object): Promise<Result> {
  const res = await fetch(`${config.baseURL}${path}`, {
    method,
    credentials: config.credentials,
    headers: await authHeaders(method, body !== undefined),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handle<Result>(res);
}

// Multipart requests (file uploads). We must NOT set Content-Type ourselves —
// the platform sets the multipart boundary. Only the auth/CSRF headers are added.
async function requestForm<Result>(method: Method, path: string, form: FormData): Promise<Result> {
  const res = await fetch(`${config.baseURL}${path}`, {
    method,
    credentials: config.credentials,
    headers: await authHeaders(method, false),
    body: form,
  });
  return handle<Result>(res);
}

export const api = {
  get: <Result>(path: string) => request<Result>("GET", path),
  post: <Result>(path: string, body?: object) => request<Result>("POST", path, body),
  patch: <Result>(path: string, body?: object) => request<Result>("PATCH", path, body),
  del: <Result>(path: string, body?: object) => request<Result>("DELETE", path, body),
  postForm: <Result>(path: string, form: FormData) => requestForm<Result>("POST", path, form),
  patchForm: <Result>(path: string, form: FormData) => requestForm<Result>("PATCH", path, form),
};

export default api;
