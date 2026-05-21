import { expect, test } from '@playwright/test';

test('landing, safety, and unauthenticated protected states load cleanly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Meet Bingo/i })).toBeVisible();

  await page.goto('/chat');
  await expect(page.getByRole('heading', { name: /A gentle place to start/i })).toBeVisible();

  await page.goto('/safety');
  await expect(page.getByText(/not a therapist/i)).toBeVisible();

  await page.goto('/journal');
  await expect(page.getByText(/Sign in required/i)).toBeVisible();
});

test('register, login, and owned journal, mood, and settings records work through the UI', async ({ page }) => {
  const email = `e2e-${Date.now()}@bingo.local`;
  const password = 'StrongPass123';

  await page.goto('/auth/register');
  await page.getByPlaceholder('Display name').fill('E2E User');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder(/Password/).fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByText(/Account created/)).toBeVisible();

  await page.goto('/auth/login');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText(/Logged in as/)).toBeVisible();

  await page.goto('/chat');
  await page.getByRole('button', { name: 'I am overthinking' }).first().click();
  await expect(page.getByText('Worry parking')).toBeVisible();

  await page.goto('/journal');
  await expect(page.getByRole('heading', { name: /Make the thought visible/i })).toBeVisible();
  await page.getByPlaceholder('Entry title').fill(`E2E note ${Date.now()}`);
  await page.getByPlaceholder(/Write privately/i).fill('A browser test reflection saved through the API.');
  await page.getByRole('button', { name: 'Save entry' }).click();
  await expect(page.getByText('A browser test reflection saved through the API.')).toBeVisible();

  await page.goto('/dashboard');
  await expect(page.getByText(/Dashboard loaded from backend APIs/i)).toBeVisible();

  await page.goto('/settings');
  await expect(page.getByText(/Settings loaded from persistent storage/i)).toBeVisible();
  await page.getByLabel('Save journal history').uncheck();
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText(/Settings saved for the current user/i)).toBeVisible();

  await page.goto('/exercises');
  await expect(page.getByText(/Exercises loaded from backend APIs/i)).toBeVisible();
});

test('mobile smoke layout keeps primary flows reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByAltText('Bingo logo')).toBeVisible();
  await expect(page.getByRole('link', { name: 'chat', exact: true })).toBeVisible();
  await page.goto('/safety');
  await expect(page.getByText(/not a therapist/i)).toBeVisible();
});

test('crisis chat works without authentication', async ({ page }) => {
  await page.goto('/chat');
  await page.getByPlaceholder(/Share what is on your mind/i).fill('I want to end my life');
  await page.getByRole('button', { name: /send/i }).click();
  await expect(page.getByText(/emergency services/i).last()).toBeVisible();
});

test('expired session returns a clean protected-state message', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'bingo_session',
      value: 'expired.invalid',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
  await page.goto('/journal');
  await expect(page.getByText(/Please log in or use demo login/i)).toBeVisible();
});
