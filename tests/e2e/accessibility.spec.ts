import { expect, test } from '@playwright/test';

test('login controls have accessible names', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('button', { name: /need an account/i })).toBeVisible();
});
