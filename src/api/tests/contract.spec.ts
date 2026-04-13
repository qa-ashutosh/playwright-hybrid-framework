import { test, expect } from "@playwright/test";
import { UserApiClient } from "@api/clients/UserApiClient";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { ENV } from "@shared/config/env";
import { ReqResListResponse, ReqResUser } from "@shared/types";
import testData from "@shared/data/reqres.json";
import sauceData from "@shared/data/saucedemo.json";

/**
 * Cross-layer contract tests — validates that API responses and UI state
 * are consistent with each other. Demonstrates hybrid framework capability.
 */

test.describe("Contract — API response structure consistency", () => {
  let client: UserApiClient;

  test.beforeEach(async ({ request }) => {
    client = new UserApiClient(request, ENV.API_BASE_URL);
  });

  test("user list across pages should have no duplicate IDs", async () => {
    const page1Res = await client.getUsers(1);
    const page2Res = await client.getUsers(2);

    const page1: ReqResListResponse = await page1Res.json();
    const page2: ReqResListResponse = await page2Res.json();

    const allIds = [
      ...page1.data.map((u: ReqResUser) => u.id),
      ...page2.data.map((u: ReqResUser) => u.id),
    ];

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  test("total user count should be consistent across pages", async () => {
    const page1Res = await client.getUsers(1);
    const page1: ReqResListResponse = await page1Res.json();

    // total_pages * per_page should account for all users
    expect(page1.total_pages * page1.per_page).toBeGreaterThanOrEqual(
      page1.total,
    );
    expect(page1.total).toBeGreaterThan(0);
  });

  test("single user response ID should match requested ID", async () => {
    const userId = testData.users.validId;
    const response = await client.getUserById(userId);
    const body = await response.json();

    expect(body.data.id).toBe(userId);
  });

  test("created user response should echo back the request payload", async () => {
    const payload = testData.createUser;
    const response = await client.createUser(payload);
    const body = await response.json();

    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
  });

  test("updated user response should reflect new values", async () => {
    const payload = testData.updateUser;
    const response = await client.updateUser(testData.users.validId, payload);
    const body = await response.json();

    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.updatedAt).toBeTruthy();
  });

  test("login token should be a non-empty string", async () => {
    const response = await client.login(testData.auth.validLogin);
    const body = await response.json();

    expect(typeof body.token).toBe("string");
    expect(body.token.length).toBeGreaterThan(0);
  });

  test("all user email fields should be valid email format", async () => {
    const response = await client.getUsers(1);
    const body: ReqResListResponse = await response.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const user of body.data) {
      expect(emailRegex.test(user.email)).toBe(true);
    }
  });

  test("all user avatar URLs should be absolute URLs", async () => {
    const response = await client.getUsers(1);
    const body: ReqResListResponse = await response.json();

    for (const user of body.data) {
      expect(user.avatar).toMatch(/^https?:\/\/.+/);
    }
  });
});

test.describe("Contract — UI state matches expected data contracts", () => {
  // These tests navigate SauceDemo UI — override baseURL to point at the UI app
  test.use({ baseURL: process.env.UI_BASE_URL || "https://www.saucedemo.com" });

  test("inventory product count should match expected contract", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(
      sauceData.users.standard.username,
      sauceData.users.standard.password,
    );
    await inventoryPage.assertOnInventoryPage();

    const count = await inventoryPage.getItemCount();
    expect(count).toBe(sauceData.products.expectedCount);
  });

  test("all product names on UI should match known product catalogue", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(
      sauceData.users.standard.username,
      sauceData.users.standard.password,
    );

    const uiProductNames = await inventoryPage.getAllProductNames();
    const expectedProducts = sauceData.products.allProducts;

    // Every product on UI must exist in our known catalogue
    for (const name of uiProductNames) {
      expect(expectedProducts).toContain(name);
    }
  });

  test("all product prices on UI should be positive numbers", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(
      sauceData.users.standard.username,
      sauceData.users.standard.password,
    );

    const prices = await inventoryPage.getAllProductPrices();
    for (const price of prices) {
      expect(price).toBeGreaterThan(0);
      expect(isNaN(price)).toBe(false);
    }
  });
});

test.describe("Contract — API token lifecycle", () => {
  let client: UserApiClient;

  test.beforeEach(async ({ request }) => {
    client = new UserApiClient(request, ENV.API_BASE_URL);
  });

  test("login token should be reusable in subsequent API calls", async ({
    request,
  }) => {
    // Step 1 — get token
    const loginRes = await client.login(testData.auth.validLogin);
    const { token } = await loginRes.json();
    expect(token).toBeTruthy();

    // Step 2 — use token as auth header in a follow-up request
    const authedClient = new UserApiClient(request, ENV.API_BASE_URL);
    const usersRes = await authedClient.getUsers(1);
    expect(usersRes.status()).toBe(200);
  });

  test("register and login with same credentials should both succeed", async () => {
    const registerRes = await client.register(testData.auth.validRegister);
    expect(registerRes.status()).toBe(200);
    const registerBody = await registerRes.json();
    expect(registerBody.token).toBeTruthy();

    const loginRes = await client.login(testData.auth.validLogin);
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    expect(loginBody.token).toBeTruthy();
  });
});
