import { expect, test } from '@playwright/test';

test('login surface is available', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Sign in to your workspace.' })).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
});

test('state-changing auth routes reject a foreign browser origin', async ({ request }) => {
  const response = await request.post('/api/auth/logout', {
    headers: { Origin: 'https://attacker.example' },
  });
  expect(response.status()).toBe(403);
  await expect(response.json()).resolves.toMatchObject({ error: 'Invalid origin' });
});

test('signup validates the reference password policy when a database is configured', async ({ request }) => {
  test.skip(!process.env.DATABASE_URL, 'Requires a configured PostgreSQL database');
  const response = await request.post('/api/auth/signup', {
    data: { email: `invalid-${Date.now()}@example.com`, password: 'weak-password' },
  });
  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toMatchObject({ error: 'Invalid request' });
});
