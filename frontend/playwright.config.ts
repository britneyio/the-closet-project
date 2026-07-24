import { defineConfig, devices } from "@playwright/test";

// End-to-end tests drive a real browser against the running stack:
//   - frontend dev server at localhost:3000 (started/reused below)
//   - Django backend at 127.0.0.1:8000 (must be up: `docker compose up`)
// Run serially with one worker: the tests share one backend database, so
// parallelism would race (unique emails aside, account-delete etc. are stateful).
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
