import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./src",
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,

  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/html-report", open: "never" }],
  ],

  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "ui-tests",
      testDir: "./src/ui/tests",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.UI_BASE_URL || "https://www.saucedemo.com",
        headless: true,
      },
    },
    {
      name: "ui-tests-firefox",
      testDir: "./src/ui/tests",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: process.env.UI_BASE_URL || "https://www.saucedemo.com",
        headless: true,
      },
    },
    {
      name: "api-tests",
      testDir: "./src/api/tests",
      use: {
        baseURL: process.env.API_BASE_URL || "https://reqres.in",
      },
    },
  ],
});
