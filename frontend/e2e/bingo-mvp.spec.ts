import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({
    'x-bingo-test-mode': 'true',
  });
});

test('chat sends quick-start prompts to the backend', async ({ page }) => {
  await page.goto('/chat');
  await page.getByRole('button', { name: 'I am overthinking' }).first().click();
  await expect(page.getByText('Worry parking')).toBeVisible();
});

test('journal persists an entry for the demo user', async ({ page }) => {
  await page.goto('/journal');
  await page.getByRole('button', { name: 'Demo login' }).click();
  await expect(page.getByRole('button', { name: 'Demo login' })).toBeHidden();
  await page.getByPlaceholder('Entry title').fill('E2E reflection');
  await page.getByPlaceholder(/Write privately/).fill('A browser test saved this reflection.');
  await page.getByRole('button', { name: 'Save entry' }).click();
  await expect(page.getByRole('heading', { name: 'E2E reflection' }).first()).toBeVisible();
});

test('settings persist region and review-gated copy is visible', async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Demo login' }).click();
  await expect(page.getByText(/Demo login active/)).toBeVisible();
  await page.getByLabel('Crisis resources region').selectOption('Egypt');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText('Settings saved for the current user.')).toBeVisible();
  await expect(page.getByText(/Real AI providers remain gated/)).toBeVisible();
});

test('basic accessibility landmarks and labels are present', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Demo login' }).click();
  await expect(page.getByLabel('Preferred language')).toBeVisible();
  await expect(page.getByLabel('Response style')).toBeVisible();
  await expect(page.getByLabel('Crisis resources region')).toBeVisible();
});
