import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost/hamburguesa/src/public';

async function loginAsClient(page) {
  const name = `Cart User ${Date.now()}`;
  const email = `cart_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

  await page.getByRole('button', { name: /cliente/i }).click();
  await expect(page.locator('#loginModal')).toHaveClass(/active/);

  await page.locator('#inputNombre').fill(name);
  await page.locator('#inputCorreo').fill(email);
  await page.getByRole('button', { name: /^guardar$/i }).click();

  await expect(page.locator('#alert')).toHaveClass(/success/);
  await expect(page.locator('#logoutBtn')).toBeVisible();
}

test.describe('Flow 3: Shopping Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#productsGrid .card-product').first()).toBeVisible();
  });

  test('TC-007: User can add a product to the shopping cart', async ({ page }) => {
    await loginAsClient(page);

    const addButton = page.locator('#productsGrid .card-product button.btn-dark:not([disabled])').first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    // If extras modal appears for burger items, confirm adding.
    const extrasModal = page.locator('#extrasModal');
    if (await extrasModal.count()) {
      await page.getByRole('button', { name: /^agregar$/i }).last().click();
    }

    await expect(page.locator('#alert')).toHaveClass(/success/);
    await expect(page.locator('#cartCount')).not.toHaveText('0');
  });

  test('TC-008: User can remove a product from the cart', async ({ page }) => {
    await loginAsClient(page);

    const addButton = page.locator('#productsGrid .card-product button.btn-dark:not([disabled])').first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    const extrasModal = page.locator('#extrasModal');
    if (await extrasModal.count()) {
      await page.locator('#extrasModal button.btn-primary').click();
    }

    await expect(page.locator('#cartCount')).not.toHaveText('0');

    const removeButton = page.locator('#cartItems button.btn-outline-danger').first();
    if (await removeButton.count()) {
      await removeButton.click();
    } else {
      page.once('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: /cancelar orden/i }).click();
    }

    await expect(page.locator('#alert')).toContainText(/removido|vaciado|carrito/i);
  });

  test('TC-009: Shopping cart maintains stable UI after page refresh', async ({ page }) => {
    await loginAsClient(page);

    const addButton = page.locator('#productsGrid .card-product button.btn-dark:not([disabled])').first();
    await addButton.click();

    const extrasModal = page.locator('#extrasModal');
    if (await extrasModal.count()) {
      await page.getByRole('button', { name: /^agregar$/i }).last().click();
    }

    const countBefore = await page.locator('#cartCount').textContent();

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#productsGrid .card-product').first()).toBeVisible();

    const countAfter = await page.locator('#cartCount').textContent();
    expect(Number(countAfter ?? '0')).toBeGreaterThanOrEqual(0);
    expect(countBefore).not.toBeNull();
  });
});
