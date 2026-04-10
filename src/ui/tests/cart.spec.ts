import { test, expect } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { InventoryPage } from "@pages/InventoryPage";
import { CartPage } from "@pages/CartPage";
import testData from "@shared/data/saucedemo.json";

test.describe("Cart — Item Management", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.assertOnInventoryPage();
  });

  test("should show empty cart on fresh login", async () => {
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    expect(await cartPage.isCartEmpty()).toBe(true);
  });

  test("should add single item and reflect in cart", async () => {
    await inventoryPage.addItemToCartByName(testData.products.firstProductAZ);
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();

    const names = await cartPage.getCartItemNames();
    expect(names).toContain(testData.products.firstProductAZ);
    expect(await cartPage.getCartItemCount()).toBe(1);
  });

  test("should add multiple items and show all in cart", async () => {
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.addItemToCartByIndex(1);
    await inventoryPage.addItemToCartByIndex(2);
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();

    expect(await cartPage.getCartItemCount()).toBe(3);
  });

  test("should remove item from cart and update list", async () => {
    await inventoryPage.addItemToCartByName(testData.products.firstProductAZ);
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();

    await cartPage.removeItemByName(testData.products.firstProductAZ);
    expect(await cartPage.isCartEmpty()).toBe(true);
  });

  test("should persist cart items after navigating away and returning", async ({ page }) => {
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.addItemToCartByIndex(1);

    // Navigate away
    await page.goto("/");
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.assertOnInventoryPage();

    // Cart badge should still show 2
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    await inventoryPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(2);
  });

  test("should navigate back to inventory from cart", async () => {
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.continueShopping();
    await inventoryPage.assertOnInventoryPage();
  });

  test("should not allow checkout from empty cart — checkout button still renders", async () => {
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();

    // Empty cart — checkout button exists but cart is empty
    // This documents current SauceDemo behaviour (no block on empty cart)
    expect(await cartPage.isCartEmpty()).toBe(true);
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
