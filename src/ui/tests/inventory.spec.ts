import { test, expect } from "@fixtures/index";
import testData from "@shared/data/saucedemo.json";

test.describe("Inventory — Product Listing", () => {

  test.beforeEach(async ({ authenticatedPage: _ }) => {
    // authenticatedPage fixture handles login automatically
  });

  test("should display correct number of products", async ({
    inventoryPage,
  }) => {
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(testData.products.expectedCount);
  });

  test("should sort products A to Z by default", async ({ inventoryPage }) => {
    const firstName = await inventoryPage.getFirstProductName();
    expect(firstName).toBe(testData.products.firstProductAZ);
  });

  test("should sort products Z to A", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("za");
    const firstName = await inventoryPage.getFirstProductName();
    expect(firstName).toBe(testData.products.firstProductZA);
  });

  test("should sort products low to high price", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("lohi");
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("should sort products high to low price", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("hilo");
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test("should add item to cart and update badge", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addItemToCartByIndex(0);
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(1);
  });

  test("should add multiple items and reflect correct badge count", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.addItemToCartByIndex(1);
    await inventoryPage.addItemToCartByIndex(2);
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(3);
  });

  test("should not show cart badge when no items added", async ({
    inventoryPage,
  }) => {
    const visible = await inventoryPage.isCartBadgeVisible();
    expect(visible).toBe(false);
  });

  test("problem_user — images should be broken (negative test)", async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(
      testData.users.problem.username,
      testData.users.problem.password
    );
    const images = await inventoryPage.getAllProductImages();
    const allSame = images.every((src) => src === images[0]);
    expect(allSame).toBe(true);
  });
});
