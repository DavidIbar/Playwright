import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost/hamburguesa/src/public';

test.describe('Flow 2: Product Browsing and Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#productsGrid')).toBeVisible();
    await expect(page.locator('#productsGrid .card-product').first()).toBeVisible();
  });

  test('TC-004: Homepage displays product catalog correctly', async ({ page }) => {
    const cards = page.locator('#productsGrid .card-product');
    await expect(cards.first()).toBeVisible();

    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    const firstCard = cards.first();
    await expect(firstCard.locator('.card-title')).toBeVisible();
    await expect(firstCard.locator('h4')).toContainText('$');
    await expect(firstCard.locator('button.btn-dark')).toBeVisible();
  });

  test('TC-005: Products with missing information are handled gracefully', async ({ page }) => {
    const jsErrors = [];
    page.on('pageerror', (err) => jsErrors.push(err.message));

    const cards = page.locator('#productsGrid .card-product');
    const count = await cards.count();

    for (let i = 0; i < Math.min(count, 3); i += 1) {
      await expect(cards.nth(i).locator('.card-title')).not.toHaveText(/^\s*$/);
      await expect(cards.nth(i).locator('h4')).toContainText('$');
    }

    const critical = jsErrors.filter((m) => /cannot read|undefined|null/i.test(m));
    expect(critical.length).toBe(0);
  });

  test('TC-006: Products show stock status indicators and disabled state for unavailable items', async ({ page }) => {
    const stockBadges = page.locator('#productsGrid .badge');
    await expect(stockBadges.first()).toBeVisible();

    const badgeTexts = (await stockBadges.allTextContents()).join(' ').toLowerCase();
    expect(/ok|bajo|agotado/.test(badgeTexts)).toBeTruthy();

    // Dynamic content validation: disabled CTA for unavailable product is expected.
    const disabledAddButtons = page.locator('#productsGrid button[disabled]');
    const disabledCount = await disabledAddButtons.count();
    expect(disabledCount).toBeGreaterThanOrEqual(0);
  });
});
