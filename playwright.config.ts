import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  retries: 0,
  use: { baseURL: "http://localhost:4173", trace: "off" },
  webServer: { command: "npx serve out -l 4173", url: "http://localhost:4173", reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: "bureau", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 360, height: 780 }, hasTouch: true } },
  ],
});
