import { Page, Locator, expect } from '@playwright/test';
import { CheckoutInfo } from '@shared/types';

export class CheckoutPage {
  readonly page: Page;

  // Step 1 — Info
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step 2 — Overview
  readonly summaryItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // Step 3 — Confirmation
  readonly confirmationHeader: Locator;
  readonly confirmationMessage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2
    this.summaryItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');

    // Step 3
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationMessage = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async assertOnCheckoutStep1(): Promise<void> {
    await expect(this.page).toHaveURL('/checkout-step-one.html');
  }

  async assertOnCheckoutStep2(): Promise<void> {
    await expect(this.page).toHaveURL('/checkout-step-two.html');
  }

  async assertOnConfirmationPage(): Promise<void> {
    await expect(this.page).toHaveURL('/checkout-complete.html');
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
  }

  async fillCheckoutInfo(info: CheckoutInfo): Promise<void> {
    if (info.firstName) await this.firstNameInput.fill(info.firstName);
    if (info.lastName) await this.lastNameInput.fill(info.lastName);
    if (info.postalCode) await this.postalCodeInput.fill(info.postalCode);
    await this.continueButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent()) ?? '';
  }

  async getPrices(): Promise<{ subtotal: number; tax: number; total: number }> {
    const subtotalText = await this.subtotalLabel.textContent() ?? '';
    const taxText = await this.taxLabel.textContent() ?? '';
    const totalText = await this.totalLabel.textContent() ?? '';

    const extract = (str: string) => parseFloat(str.replace(/[^0-9.]/g, ''));

    return {
      subtotal: extract(subtotalText),
      tax: extract(taxText),
      total: extract(totalText),
    };
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async goBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
