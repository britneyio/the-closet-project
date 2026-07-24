import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "shared/store/hooks";

/** Route guard: bounce unauthenticated users to the landing page. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthed = useAppSelector((state) => state.auth.status === "authenticated");
  if (!isAuthed) return <Navigate to="/" replace />;
  return <>{children}</>;
}
