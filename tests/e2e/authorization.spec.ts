import { expect, test } from '@playwright/test';

test.describe('database-backed workspace authorization', () => {
  test.skip(
    !process.env.DATABASE_URL || !process.env.E2E_EMAIL || !process.env.E2E_PASSWORD,
    'Requires PostgreSQL plus an E2E account seeded with LAND_DEMO_EMAIL/LAND_DEMO_PASSWORD',
  );

  test('a seeded member can sign in and open the land workspace', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.E2E_EMAIL as string);
    await page.getByLabel('Password').fill(process.env.E2E_PASSWORD as string);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/land\/land-portfolio/);
    await expect(page.getByRole('heading', { name: 'AI Assistant' })).toBeVisible();
  });

  test('an unauthenticated caller is redirected away from the workspace', async ({ page }) => {
    await page.goto('/land/land-portfolio?matterId=portfolio-001');
    await expect(page).toHaveURL('/');
  });
});
