import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost/hamburguesa/src/public';

function uniqueEmail() {
  return `qa_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
}

test.describe('Flow 1: User Authentication (Login)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#authBtn')).toBeVisible();
  });

  test('TC-001: User can successfully register/login from Cliente modal and update UI state', async ({ page }) => {
    const name = `QA User ${Date.now()}`;
    const email = uniqueEmail();

    await page.getByRole('button', { name: /cliente/i }).click();
    await expect(page.locator('#loginModal')).toHaveClass(/active/);

    await page.locator('#inputNombre').fill(name);
    await page.locator('#inputCorreo').fill(email);
    await page.locator('#inputTelefono').fill('5512345678');

    await page.getByRole('button', { name: /^guardar$/i }).click();

    const alert = page.locator('#alert');
    await expect(alert).toHaveClass(/success/);
    await expect(alert).toContainText(/bienvenido/i);

    await expect(page.locator('#userDisplay')).toContainText(name);
    await expect(page.locator('#userRole')).toContainText(/cliente/i);
    await expect(page.locator('#logoutBtn')).toBeVisible();

    // Navigation/state validation: UI changes from guest to authenticated user.
    await expect(page.locator('#authBtn')).toBeHidden();
  });

  test('TC-002: User receives visible error feedback with invalid staff credentials', async ({ page }) => {
    await page.locator('#authBtn').click();
    await expect(page.locator('#authModal')).toHaveClass(/active/);

    await page.locator('#authCorreo').fill('wrong@wrong.com');
    await page.locator('#authPassword').fill('wrongpassword');
    await page.getByRole('button', { name: /^entrar$/i }).click();

    const alert = page.locator('#alert');
    await expect(alert).toHaveClass(/error/);
    await expect(alert).toContainText(/credenciales|error/i);

    // User should remain on same page (no redirect).
    await expect(page).toHaveURL(/index\.html/);
    await expect(page.locator('#authModal')).toHaveClass(/active/);
  });

  test('TC-003: Empty staff login blocks submission and shows validation feedback', async ({ page }) => {
    let loginRequests = 0;
    page.on('request', (request) => {
      if (request.url().includes('/login.php')) loginRequests += 1;
    });

    await page.locator('#authBtn').click();
    await expect(page.locator('#authModal')).toHaveClass(/active/);

    await page.getByRole('button', { name: /^entrar$/i }).click();

    const alert = page.locator('#alert');
    await expect(alert).toHaveClass(/error/);
    await expect(alert).toContainText(/ingrese correo y contraseña/i);

    // Edge behavior from UX spec: empty form should not trigger API request.
    expect(loginRequests).toBe(0);
  });
});
