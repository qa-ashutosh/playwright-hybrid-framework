import { Page, Locator, expect } from "@playwright/test";
import { SortOption } from "@shared/types";

export class InventoryPage {
  readonly page: Page;

  // Locators
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(".title");
    this.inventoryItems = page.locator(".inventory_item");
    this.sortDropdown = page.locator('.product_sort_container');
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartIcon = page.locator(".shopping_cart_link");
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator("#logout_sidebar_link");
  }

  async assertOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL("/inventory.html");
    await expect(this.pageTitle).toHaveText("Products");
  }

  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getFirstProductName(): Promise<string> {
    const firstName = await this.inventoryItems
      .first()
      .locator(".inventory_item_name")
      .textContent();
    return firstName ?? "";
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.inventoryItems
      .locator(".inventory_item_name")
      .allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItems
      .locator(".inventory_item_price")
      .allTextContents();
    return priceTexts.map((p) => parseFloat(p.replace("$", "")));
  }

  async addItemToCartByIndex(index: number): Promise<void> {
    const addButtons = this.inventoryItems.locator('button[id^="add-to-cart"]');
    await addButtons.nth(index).click();
  }

  async addItemToCartByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.locator('button[id^="add-to-cart"]').click();
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? "0", 10);
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.cartBadge.isVisible();
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: "visible" });
    await this.logoutLink.click();
  }

  async getAllProductImages(): Promise<string[]> {
    return await this.inventoryItems
      .locator(".inventory_item_img img")
      .evaluateAll((imgs) =>
        (imgs as HTMLImageElement[]).map(
          (img) => img.getAttribute("src") ?? "",
        ),
      );
  }
}
