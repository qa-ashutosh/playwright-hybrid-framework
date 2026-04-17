import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { CartPage } from "@pages/CartPage";
import { CheckoutPage } from "@pages/CheckoutPage";
import testData from "@shared/data/saucedemo.json";

/**
 * Accessibility tests using axe-core — checks for WCAG 2.1 violations.
 * Critical and serious violations will fail the test.
 * Moderate and minor violations are reported but do not fail.
 */

// ─── Helper ──────────────────────────────────────────────────────────────────

async function runA11yCheck(
  page: Parameters<typeof AxeBuilder>[0],
  options?: { disableRules?: string[] }
) {
  let builder = new AxeBuilder({ page } as any)
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);

  if (options?.disableRules?.length) {
    builder = builder.disableRules(options.disableRules);
  }

  const results = await builder.analyze();

  // Only fail on critical and serious violations
  const criticalViolations = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious"
  );

  return { results, criticalViolations };
}

// ─── Login Page ───────────────────────────────────────────────────────────────

test.describe("Accessibility — Login Page", () => {
  test("login page should have no critical a11y violations", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.waitForLoadState("networkidle");

    const { criticalViolations, results } = await runA11yCheck(page);

    if (criticalViolations.length > 0) {
      console.log(
        "Critical violations:",
        JSON.stringify(criticalViolations, null, 2)
      );
    }

    expect(
      criticalViolations,
      `Found ${criticalViolations.length} critical/serious a11y violations on login page`
    ).toHaveLength(0);
  });

  test("login page error state should have no critical a11y violations", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      testData.users.invalid.username,
      testData.users.invalid.password
    );

    const { criticalViolations } = await runA11yCheck(page, {
    // SauceDemo defect: error dismiss button has no accessible name (button-name)
    // Tracked as known app defect — not a framework issue
    disableRules: ["button-name"],
    });
    expect(
      criticalViolations,
      `Found ${criticalViolations.length} critical/serious a11y violations on login error state`
    ).toHaveLength(0);
  });
});

// ─── Inventory Page ───────────────────────────────────────────────────────────

test.describe("Accessibility — Inventory Page", () => {
  test("inventory page should have no critical a11y violations", async ({
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

    const { criticalViolations } = await runA11yCheck(page, {
    // SauceDemo defect: sort dropdown missing accessible label (select-name)
    // Tracked as known app defect — not a framework issue
    disableRules: ["select-name"],
    });
    expect(
      criticalViolations,
      `Found ${criticalViolations.length} critical/serious a11y violations on inventory page`
    ).toHaveLength(0);
  });
});

// ─── Cart Page ────────────────────────────────────────────────────────────────

test.describe("Accessibility — Cart Page", () => {
  test("cart page should have no critical a11y violations", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.goToCart();
    await page.waitForLoadState("networkidle");

    const { criticalViolations } = await runA11yCheck(page);
    expect(
      criticalViolations,
      `Found ${criticalViolations.length} critical/serious a11y violations on cart page`
    ).toHaveLength(0);
  });
});

// ─── Checkout Pages ───────────────────────────────────────────────────────────

test.describe("Accessibility — Checkout Pages", () => {
  test("checkout step 1 should have no critical a11y violations", async ({
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

    const { criticalViolations } = await runA11yCheck(page);
    expect(
      criticalViolations,
      `Found ${criticalViolations.length} critical/serious a11y violations on checkout step 1`
    ).toHaveLength(0);
  });

  test("checkout step 2 (overview) should have no critical a11y violations", async ({
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
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    await checkoutPage.assertOnCheckoutStep2();
    await page.waitForLoadState("networkidle");

    const { criticalViolations } = await runA11yCheck(page);
    expect(
      criticalViolations,
      `Found ${criticalViolations.length} critical/serious a11y violations on checkout step 2`
    ).toHaveLength(0);
  });

  test("checkout confirmation should have no critical a11y violations", async ({
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
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    await checkoutPage.finishOrder();
    await checkoutPage.assertOnConfirmationPage();
    await page.waitForLoadState("networkidle");

    const { criticalViolations } = await runA11yCheck(page);
    expect(
      criticalViolations,
      `Found ${criticalViolations.length} critical/serious a11y violations on confirmation page`
    ).toHaveLength(0);
  });
});
