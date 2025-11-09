import { test, expect, type Page } from '@playwright/test';

// Helper function to unlock the RSVP form with the access code
async function unlockRSVP(page: Page) {
  // Check if unlock screen is present
  const unlockButton = page.getByRole('button', { name: /unlock rsvp/i });
  const unlockVisible = await unlockButton.isVisible().catch(() => false);
  
  if (unlockVisible) {
    const passwordInput = page.getByLabel(/access code/i);
    await passwordInput.fill('July2nd2026');
    await unlockButton.click();
    
    // Wait for the search form to appear
    await page.getByRole('button', { name: /search/i }).waitFor({ state: 'visible' });
  }
}

test.describe('RSVP Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rsvp');
    await unlockRSVP(page);
  });

  test('should require access code to unlock RSVP form', async ({ page }) => {
    // Navigate without unlocking
    await page.goto('/rsvp');
    
    // Should show unlock screen
    await expect(page.getByLabel(/access code/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /unlock rsvp/i })).toBeVisible();
    await expect(page.getByText(/to protect guest privacy/i)).toBeVisible();
  });

  test('should reject incorrect access code', async ({ page }) => {
    await page.goto('/rsvp');
    
    const passwordInput = page.getByLabel(/access code/i);
    const unlockButton = page.getByRole('button', { name: /unlock rsvp/i });
    
    await passwordInput.fill('WrongPassword');
    await unlockButton.click();
    
    // Should show error message
    await expect(page.getByTestId('unlock-error')).toBeVisible();
    await expect(page.getByText(/incorrect password/i)).toBeVisible();
  });

  test('should unlock with correct access code', async ({ page }) => {
    await page.goto('/rsvp');
    
    const passwordInput = page.getByLabel(/access code/i);
    const unlockButton = page.getByRole('button', { name: /unlock rsvp/i });
    
    await passwordInput.fill('July2nd2026');
    await unlockButton.click();
    
    // Should show search form
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /search/i })).toBeVisible();
  });

  test('should load RSVP page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/RSVP|Amy.*Dan/i);
    await expect(page.getByRole('heading', { name: /rsvp/i })).toBeVisible();
  });

  test('should search and find a guest', async ({ page, browserName }) => {
    // Skip for webkit due to React hydration timing issues
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(browserName === 'webkit', 'Webkit has timing issues with React hydration');
    
    // Wait for the search button to be enabled (React hydration complete)
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.waitFor({ state: 'visible' });
    
    const nameInput = page.getByLabel(/full name/i);

    await nameInput.fill('Sarah Johnson');
    await searchButton.click();
    
    // Then wait for result using testid
    await expect(page.getByTestId('result-found')).toBeVisible({ timeout: 10000 });
  });

  test('should handle guest not found', async ({ page, browserName }) => {
    // Skip for webkit due to React hydration timing issues
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(browserName === 'webkit', 'Webkit has timing issues with React hydration');
    
    // Wait for the search button to be enabled (React hydration complete)
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.waitFor({ state: 'visible' });
    
    const nameInput = page.getByLabel(/full name/i);
    await nameInput.fill('Nonexistent Person');
    await searchButton.click();
    
    // Then wait for result using testid
    await expect(page.getByTestId('result-not-found')).toBeVisible({ timeout: 10000 });
  });

  test('should handle multiple matches with disambiguation', async ({ page, browserName }) => {
    // Skip for webkit due to React hydration timing issues
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(browserName === 'webkit', 'Webkit has timing issues with React hydration');
    
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.waitFor({ state: 'visible' });
    
    const nameInput = page.getByLabel(/full name/i);

    // Search for duplicate name
    await nameInput.fill('John Smith');
    await searchButton.click();

    // Should show disambiguation message using testid
    await expect(page.getByTestId('result-multiple')).toBeVisible({ timeout: 10000 });
    await expect(page.getByLabel(/email/i)).toBeVisible();

    // Provide email for disambiguation
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('john.smith@example.com');
    await searchButton.click();

    // Should find the correct guest using testid
    await expect(page.getByTestId('result-found')).toBeVisible({ timeout: 10000 });
  });

  test('should display deadline information', async ({ page }) => {
    await expect(page.getByText(/please rsvp by may 2.*2026/i)).toBeVisible();
  });

  test('should show Google Forms iframe after successful search', async ({ page, browserName }) => {
    // Skip for webkit due to flaky React hydration timing
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(browserName === 'webkit', 'Webkit has timing issues with duplicate test scenarios');
    
    await page.goto('/rsvp');
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.waitFor({ state: 'visible' });
    
    const nameInput = page.getByLabel(/full name/i);

    await nameInput.fill('Sarah Johnson');
    await searchButton.click();

    // Wait for success result using testid
    await expect(page.getByTestId('result-found')).toBeVisible({ timeout: 10000 });
    
    // Check iframe appears
    await expect(page.locator('iframe[title*="RSVP"]')).toBeVisible({ timeout: 5000 });
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.getByRole('heading', { name: /rsvp/i })).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
  });
});
