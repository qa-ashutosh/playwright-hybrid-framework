import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./src",
  timeout: 30000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 2,

  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/html-report", open: "never" }],
    ["allure-playwright", { resultsDir: "allure-results" }],
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
      name: "visual-tests",
      testDir: "./src/ui/tests/visual",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.UI_BASE_URL || "https://www.saucedemo.com",
        headless: true,
      },
    },
    {
      name: "a11y-tests",
      testDir: "./src/ui/tests/a11y",
      use: {
        ...devices["Desktop Chrome"],
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
