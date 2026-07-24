/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Backend the dev server proxies to. Proxying keeps API + media same-origin in
// dev, which is required for the httpOnly auth cookie (SameSite) to work.
const DEV_BACKEND = process.env.VITE_DEV_BACKEND ?? "http://127.0.0.1:8000";

// Content-Security-Policy injected as a <meta>. Strict in production; dev adds
// what Vite HMR needs ('unsafe-eval', ws:). A server response header is the
// stronger home for CSP in prod (it can set frame-ancestors) — see deploy docs.
function cspPlugin(isDev: boolean): Plugin {
  const csp = [
    "default-src 'self'",
    // styled-components injects <style> tags -> style needs 'unsafe-inline'.
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self'${isDev ? " 'unsafe-inline' 'unsafe-eval'" : ""}`,
    // In dev the API returns absolute media URLs on the backend origin (the
    // proxy sets Host to DEV_BACKEND), so <img> must be allowed to load from it.
    `img-src 'self' data: blob:${isDev ? ` ${DEV_BACKEND}` : ""}`,
    "font-src 'self' data:",
    `connect-src 'self' https://*.ingest.sentry.io${isDev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  return {
    name: "html-csp",
    transformIndexHtml(html) {
      return html.replace(
        "</head>",
        `  <meta http-equiv="Content-Security-Policy" content="${csp}" />\n  </head>`
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const isDev = mode !== "production";
  return {
    plugins: [react(), cspPlugin(isDev)],
    resolve: {
      // Monorepo: `shared` is a workspace package at the repo root. Alias it to
      // the real source so Vite transforms its .ts; its bare imports
      // (@reduxjs/toolkit, react-redux) resolve from the hoisted root node_modules.
      alias: { shared: path.resolve(__dirname, "../shared") },
    },
    server: {
      port: 3000,
      open: true,
      // Same-origin proxy so the auth cookie and media load without CORS.
      proxy: {
        "/api": { target: DEV_BACKEND, changeOrigin: true },
        "/media": { target: DEV_BACKEND, changeOrigin: true },
      },
    },
    build: { outDir: "build" },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      // Include the shared package's tests (they live outside this app's src
      // in the monorepo) alongside the web component tests.
      include: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "../shared/**/*.{test,spec}.{ts,tsx}",
      ],
    },
  };
});
