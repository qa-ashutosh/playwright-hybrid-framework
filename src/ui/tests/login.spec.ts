import { test, expect } from "@fixtures/index";
import testData from "@shared/data/saucedemo.json";

test.describe("Login — Authentication", () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("should login successfully with valid credentials", async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.assertOnInventoryPage();
  });

  test("should show error for invalid credentials", async ({ loginPage }) => {
    await loginPage.login(
      testData.users.invalid.username,
      testData.users.invalid.password
    );
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Username and password do not match");
  });

  test("should show error for locked out user", async ({ loginPage }) => {
    await loginPage.login(
      testData.users.locked.username,
      testData.users.locked.password
    );
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Sorry, this user has been locked out");
  });

  test("should show error when username is empty", async ({ loginPage }) => {
    await loginPage.login("", testData.users.standard.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Username is required");
  });

  test("should show error when password is empty", async ({ loginPage }) => {
    await loginPage.login(testData.users.standard.username, "");
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Password is required");
  });

  test("should redirect unauthenticated user from inventory to login", async ({
    page,
    loginPage,
  }) => {
    await page.goto("/inventory.html");
    await loginPage.assertOnLoginPage();
  });

  test("should logout successfully", async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await inventoryPage.assertOnInventoryPage();
    await inventoryPage.logout();
    await loginPage.assertOnLoginPage();
  });
});
