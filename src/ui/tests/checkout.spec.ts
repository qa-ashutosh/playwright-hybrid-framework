import { test, expect } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { CartPage } from "@pages/CartPage";
import { CheckoutPage } from "@pages/CheckoutPage";
import testData from "@shared/data/saucedemo.json";

test.describe("Checkout — Full Purchase Flow", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Standard setup: login → add item → go to cart → proceed to checkout
    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.assertOnInventoryPage();
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnCheckoutStep1();
  });

  // ─── Happy Path ─────────────────────────────────────────────────────────────

  test("should complete full checkout flow successfully", async () => {
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    await checkoutPage.assertOnCheckoutStep2();
    await checkoutPage.finishOrder();
    await checkoutPage.assertOnConfirmationPage();
  });

  test("should display correct confirmation message after order", async () => {
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    await checkoutPage.finishOrder();

    await expect(checkoutPage.confirmationHeader).toHaveText(
      "Thank you for your order!"
    );
    await expect(checkoutPage.confirmationMessage).toBeVisible();
  });

  test("should navigate back to inventory after order confirmation", async () => {
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    await checkoutPage.finishOrder();
    await checkoutPage.assertOnConfirmationPage();
    await checkoutPage.goBackHome();
    await inventoryPage.assertOnInventoryPage();
  });

  // ─── Price Validation ────────────────────────────────────────────────────────

  test("should calculate total as subtotal + tax on overview page", async () => {
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    await checkoutPage.assertOnCheckoutStep2();

    const { subtotal, tax, total } = await checkoutPage.getPrices();

    // Allow 2 decimal rounding tolerance
    expect(Math.abs(subtotal + tax - total)).toBeLessThanOrEqual(0.01);
  });

  test("should show correct item count on overview page", async () => {
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    await checkoutPage.assertOnCheckoutStep2();

    const itemCount = await checkoutPage.summaryItems.count();
    expect(itemCount).toBe(1);
  });

  // ─── Validation Errors ───────────────────────────────────────────────────────

  test("should show error when first name is missing", async () => {
    await checkoutPage.fillCheckoutInfo(testData.checkout.missingFirstName);
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain("First Name is required");
  });

  test("should show error when last name is missing", async () => {
    await checkoutPage.fillCheckoutInfo(testData.checkout.missingLastName);
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain("Last Name is required");
  });

  test("should show error when postal code is missing", async () => {
    await checkoutPage.fillCheckoutInfo(testData.checkout.missingPostalCode);
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain("Postal Code is required");
  });

  // ─── Navigation ──────────────────────────────────────────────────────────────

  test("should cancel checkout and return to cart", async () => {
    await checkoutPage.cancelButton.click();
    await cartPage.assertOnCartPage();
  });
});

// ─── Problem User — Checkout Negative Tests ───────────────────────────────────

test.describe("Checkout — problem_user negative flows", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.problem.username,
      testData.users.problem.password
    );
    await inventoryPage.assertOnInventoryPage();
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnCheckoutStep1();
  });

  test("problem_user — last name field should not accept input", async ({ page }) => {
    // problem_user has a known bug: last name field is broken
    await checkoutPage.firstNameInput.fill(testData.checkout.valid.firstName);
    await checkoutPage.lastNameInput.fill(testData.checkout.valid.lastName);

    const lastNameValue = await checkoutPage.lastNameInput.inputValue();
    // Documents the known defect: last name stays empty regardless of input
    expect(lastNameValue).toBe("");
  });

  test("problem_user — cannot proceed past checkout step 1", async () => {
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    // Should show last name error due to broken field
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain("Last Name is required");
  });
});
