import { Page } from '@playwright/test';

/**
 * Waits for network to be idle — useful before taking visual snapshots
 */
export async function waitForNetworkIdle(page: Page, timeout = 3000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Returns a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formats a price string like "$9.99" to a float 9.99
 */
export function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace('$', '').trim());
}

/**
 * Strips whitespace and lowercases a string for loose comparison
 */
export function normalize(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Builds a full API URL from a base and path
 */
export function buildUrl(base: string, path: string): string {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
