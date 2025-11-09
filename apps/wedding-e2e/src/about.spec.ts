import { test, expect } from '@playwright/test';

test.describe('About Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should load About page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/About the Day|Amy.*Dan/i);
    
    // Check main heading is visible
    await expect(page.getByRole('heading', { name: /about the day/i, level: 1 })).toBeVisible();
  });

  test('should display all required sections', async ({ page }) => {
    // Venue section
    await expect(page.getByRole('heading', { name: /venue/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /thorpe gardens/i, level: 3 })).toBeVisible();
    await expect(page.getByText(/b79 7xx/i)).toBeVisible();
    
    // Schedule section
    await expect(page.getByRole('heading', { name: /schedule/i })).toBeVisible();
    
    // Dress code section
    await expect(page.getByRole('heading', { name: /dress code/i })).toBeVisible();
    
    // Accommodations section
    await expect(page.getByRole('heading', { name: /accommodations/i })).toBeVisible();
  });

  test('should display wedding date information', async ({ page }) => {
    // Wedding is on Thursday July 2nd 2026
    await expect(page.getByText(/july.*2.*2026/i)).toBeVisible();
  });

  test('should display schedule timeline', async ({ page }) => {
    // Should have time entries in the schedule
    const scheduleSection = page.locator('section', { has: page.getByRole('heading', { name: /schedule/i }) });
    await expect(scheduleSection).toBeVisible();
    
    // Should have at least one time listed
    await expect(page.getByText(/\d{1,2}:\d{2}\s*(am|pm)/i).first()).toBeVisible();
  });

  test('should display venue address and directions', async ({ page }) => {
    const venueSection = page.locator('section', { has: page.getByRole('heading', { name: /venue/i }) });
    
    // Should have address or postcode
    await expect(venueSection.getByText(/address|postcode|B\d+\s*\d+[A-Z]{2}/i)).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Main heading should be visible
    await expect(page.getByRole('heading', { name: /about the day/i })).toBeVisible();
    
    // All sections should still be accessible
    await expect(page.getByRole('heading', { name: /venue/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /schedule/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /dress code/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /accommodations/i })).toBeVisible();
  });

  test('should use semantic HTML', async ({ page }) => {
    // Should have main element
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Should have section elements for organization
    const sections = page.locator('section');
    await expect(sections).toHaveCount(5); // Venue, Schedule, Dress Code, Accommodations, Good to Know
  });
});
