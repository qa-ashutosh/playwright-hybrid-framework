import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import testData from '@shared/data/saucedemo.json';

test.describe('Inventory — Product Listing', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.assertOnInventoryPage();
  });

  test('should display correct number of products', async () => {
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(testData.products.expectedCount);
  });

  test('should sort products A to Z by default', async () => {
    const firstName = await inventoryPage.getFirstProductName();
    expect(firstName).toBe(testData.products.firstProductAZ);
  });

  test('should sort products Z to A', async () => {
    await inventoryPage.sortBy('za');
    const firstName = await inventoryPage.getFirstProductName();
    expect(firstName).toBe(testData.products.firstProductZA);
  });

  test('should sort products low to high price', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('should sort products high to low price', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('should add item to cart and update badge', async () => {
    await inventoryPage.addItemToCartByIndex(0);
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(1);
  });

  test('should add multiple items and reflect correct badge count', async () => {
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.addItemToCartByIndex(1);
    await inventoryPage.addItemToCartByIndex(2);
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(3);
  });

  test('should not show cart badge when no items added', async () => {
    const visible = await inventoryPage.isCartBadgeVisible();
    expect(visible).toBe(false);
  });

  test('problem_user — images should be broken (negative test)', async ({ page }) => {
    const problemLogin = new LoginPage(page);
    await problemLogin.goto();
    await problemLogin.login(
      testData.users.problem.username,
      testData.users.problem.password
    );
    const problemInventory = new InventoryPage(page);
    const images = await problemInventory.getAllProductImages();
    // problem_user has the same broken image src for all items
    const allSame = images.every(src => src === images[0]);
    expect(allSame).toBe(true);
  });
});
