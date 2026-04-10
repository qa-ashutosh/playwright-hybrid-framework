import { test, expect } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { CartPage } from "@pages/CartPage";
import { CheckoutPage } from "@pages/CheckoutPage";
import testData from "@shared/data/saucedemo.json";

/**
 * End-to-end purchase flows — tests the complete user journey
 * across multiple pages in a single test run.
 * Intentionally kept separate from unit-style page tests.
 */

test.describe("E2E — Complete Purchase Journey", () => {
  test("standard_user — add single item and complete purchase", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.assertOnInventoryPage();

    // Add item
    await inventoryPage.addItemToCartByName(testData.products.firstProductAZ);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    // Cart
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).toContain(testData.products.firstProductAZ);

    // Checkout step 1
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnCheckoutStep1();
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);

    // Checkout step 2 — verify price
    await checkoutPage.assertOnCheckoutStep2();
    const { subtotal, tax, total } = await checkoutPage.getPrices();
    expect(subtotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThan(0);
    expect(Math.abs(subtotal + tax - total)).toBeLessThanOrEqual(0.01);

    // Confirm order
    await checkoutPage.finishOrder();
    await checkoutPage.assertOnConfirmationPage();
  });

  test("standard_user — add multiple items and complete purchase", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.assertOnInventoryPage();

    // Add 3 items
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.addItemToCartByIndex(1);
    await inventoryPage.addItemToCartByIndex(2);
    expect(await inventoryPage.getCartBadgeCount()).toBe(3);

    await inventoryPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(3);

    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    await checkoutPage.assertOnCheckoutStep2();

    // Overview should show 3 items
    expect(await checkoutPage.summaryItems.count()).toBe(3);

    await checkoutPage.finishOrder();
    await checkoutPage.assertOnConfirmationPage();
  });

  test("standard_user — remove item from cart before checkout", async ({ page }) => {
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
    await inventoryPage.addItemToCartByIndex(1);
    await inventoryPage.goToCart();

    // Remove one item
    const itemNames = await cartPage.getCartItemNames();
    await cartPage.removeItemByName(itemNames[0]);
    expect(await cartPage.getCartItemCount()).toBe(1);

    // Complete checkout with remaining item
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(testData.checkout.valid);
    await checkoutPage.finishOrder();
    await checkoutPage.assertOnConfirmationPage();
  });
});
