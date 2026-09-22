import { test, expect } from '@playwright/test';

test.describe('E-commerce Checkout Flow', () => {
  test('should successfully add an item to the cart', async ({ page }) => {
    // 1. Navigate to the demo site
    await page.goto('https://www.saucedemo.com/');

    // 2. Perform Login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 3. Verify successful login by checking the URL and inventory visibility
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');

    // 4. Add the first item to the cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // 5. Verify the shopping cart badge updates to 1
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
  });
});