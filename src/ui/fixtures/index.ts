import { test as base, Page } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { CartPage } from "@pages/CartPage";
import { CheckoutPage } from "@pages/CheckoutPage";
import { UserApiClient } from "@api/clients/UserApiClient";
import { ENV } from "@shared/config/env";
import testData from "@shared/data/saucedemo.json";

// ─── Type Definitions ─────────────────────────────────────────────────────────

type PageObjects = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

type AuthenticatedFixtures = PageObjects & {
  authenticatedPage: Page;
  apiClient: UserApiClient;
};

// ─── Base Page Object Fixture ─────────────────────────────────────────────────

/**
 * Provides all POM instances pre-wired to the current page.
 * Eliminates repetitive `new XxxPage(page)` boilerplate in every test.
 */
export const test = base.extend<AuthenticatedFixtures>({

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // ─── Pre-authenticated Page ─────────────────────────────────────────────────

  /**
   * Provides a page that is already logged in as standard_user.
   * Use this fixture in any test that doesn't need to test the login flow itself.
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.assertOnInventoryPage();
    await use(page);
    // Teardown — clear cookies/storage after test
    await page.context().clearCookies();
  },

  // ─── API Client Fixture ─────────────────────────────────────────────────────

  /**
   * Provides a pre-configured UserApiClient instance.
   * Eliminates boilerplate `new UserApiClient(request, ENV.API_BASE_URL)` setup.
   */
  apiClient: async ({ request }, use) => {
    const client = new UserApiClient(request, ENV.API_BASE_URL);
    await use(client);
  },
});

export { expect } from "@playwright/test";
