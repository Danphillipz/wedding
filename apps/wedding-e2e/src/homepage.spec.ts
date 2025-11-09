import { test, expect } from '@playwright/test';

test.describe('Homepage E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Amy & Dan.*Wedding/i);
  });

  test('should display hero image', async ({ page }) => {
    const heroImage = page.getByRole('img', { name: /amy.*dan.*wedding/i });
    await expect(heroImage).toBeVisible();
  });

  test('should display wedding announcement', async ({ page }) => {
    await expect(page.getByText(/we're getting married/i)).toBeVisible();
  });

  test('should display wedding date', async ({ page }) => {
    await expect(page.getByText(/thursday july 2nd 2026/i)).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /rsvp/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    
    await expect(page.getByText(/we're getting married/i)).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
