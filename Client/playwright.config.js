import { defineConfig, devices } from "@playwright/test";

// End-to-end tests drive the real storefront against a real Laravel API.
// E2E_API_ORIGIN points at the API (seeded, with the demo accounts). In CI,
// E2E_START_API=1 also starts it with `php artisan serve`; locally, run the
// Docker image instead (see the README's "End-to-end tests").
const API_ORIGIN = process.env.E2E_API_ORIGIN || "http://127.0.0.1:8000";
const STORE_PORT = 5174;
const STORE_URL = `http://localhost:${STORE_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // The tests share one database and the API rate-limits logins, so run them one at a time.
  workers: 1,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 60_000,
  use: {
    baseURL: STORE_URL,
    // The GSAP intro and page transitions only run when motion is allowed.
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  metadata: { apiOrigin: API_ORIGIN },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    ...(process.env.E2E_START_API
      ? [
          {
            command: "php artisan serve --host=127.0.0.1 --port=8000",
            cwd: "../Server",
            url: `${API_ORIGIN}/api/jerseys`,
            timeout: 60_000,
            reuseExistingServer: false,
          },
        ]
      : []),
    {
      command: `npx vite --port ${STORE_PORT} --strictPort`,
      url: STORE_URL,
      timeout: 60_000,
      reuseExistingServer: false,
      env: {
        VITE_API_BASE_URL: `${API_ORIGIN}/api`,
        VITE_ASSET_BASE_URL: API_ORIGIN,
      },
    },
  ],
});
