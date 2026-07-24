// Frontend error tracking — mirrors the backend Sentry setup. No-op unless
// VITE_SENTRY_DSN is set (dev/CI need nothing external), privacy-preserving
// (sendDefaultPii: false), and scrubbed so user data never leaves the client.
import * as Sentry from "@sentry/react";

// Redact obvious PII/secrets from any string before it's sent to Sentry.
function scrub(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/gi, "[email]")
    .replace(/(Token|Bearer)\s+[\w-]+/gi, "$1 [redacted]")
    .replace(/(csrftoken|auth_token|password)=[^;&\s]+/gi, "$1=[redacted]");
}

export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return; // silent no-op in dev/CI

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    integrations: [Sentry.browserTracingIntegration()],
    beforeSend(event) {
      // ApiError carries a `body` that can echo user input (e.g. an email in a
      // validation message). Never ship it, and scrub messages/request data.
      if (event.request?.headers) {
        delete event.request.headers["Authorization"];
        delete event.request.headers["Cookie"];
      }
      if (event.request?.cookies) delete event.request.cookies;
      for (const ex of event.exception?.values ?? []) {
        if (ex.value) ex.value = scrub(ex.value);
      }
      if (event.message) event.message = scrub(event.message);
      return event;
    },
  });
}

export const ErrorBoundary = Sentry.ErrorBoundary;
