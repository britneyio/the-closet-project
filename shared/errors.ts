// Centralized error narrowing. TypeScript types every `catch` binding as
// `unknown` (the safe counterpart to `any` — it must be narrowed before use),
// so this is the ONE place that unknown is handled. Feature code calls these
// helpers and never touches `unknown` itself.
import { ApiError } from "./api/client";

export function errorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export function hasStatus(err: unknown, status: number): boolean {
  return err instanceof ApiError && err.status === status;
}
