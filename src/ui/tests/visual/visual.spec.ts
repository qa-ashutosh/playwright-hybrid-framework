import { test, expect } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { CartPage } from "@pages/CartPage";
import { CheckoutPage } from "@pages/CheckoutPage";
import testData from "@shared/data/saucedemo.json";

/**
 * Visual regression tests — captures baseline screenshots and diffs on
 * subsequent runs. Run `npm run test:visual:update` to update baselines.
 *
 * Baselines are stored in: src/ui/tests/visual/__snapshots__/
 */

test.describe("Visual Regression — Login Page", () => {
  test("login page should match baseline", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("login-page.png", {
      fullPage: true,
    });
  });

  test("login page with error should match baseline", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      testData.users.invalid.username,
      testData.users.invalid.password
    );
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("login-page-error.png", {
      fullPage: true,
    });
  });
});

test.describe("Visual Regression — Inventory Page", () => {
  test("inventory page (standard_user) should match baseline", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.assertOnInventoryPage();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("inventory-standard-user.png", {
      fullPage: true,
    });
  });

  test("inventory page (problem_user) should differ from standard_user baseline", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.problem.username,
      testData.users.problem.password
    );
    await inventoryPage.assertOnInventoryPage();
    await page.waitForLoadState("networkidle");

    // Intentionally captures broken state as its own baseline
    await expect(page).toHaveScreenshot("inventory-problem-user.png", {
      fullPage: true,
    });
  });

  test("inventory page sorted Z-A should match baseline", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.sortBy("za");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("inventory-sorted-za.png", {
      fullPage: true,
    });
  });
});

test.describe("Visual Regression — Cart Page", () => {
  test("cart page with items should match baseline", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.addItemToCartByIndex(1);
    await inventoryPage.goToCart();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("cart-with-items.png", {
      fullPage: true,
    });
  });
});

test.describe("Visual Regression — Checkout", () => {
  test("checkout step 1 (info form) should match baseline", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnCheckoutStep1();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("checkout-step1.png", {
      fullPage: true,
    });
  });

  test("checkout confirmation page should match baseline", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    await checkoutPage.finishOrder();
    await checkoutPage.assertOnConfirmationPage();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("checkout-confirmation.png", {
      fullPage: true,
    });
  });
});
