import { test, expect } from '@playwright/test';
import { ElectronApplication, Page, _electron as electron } from 'playwright';

test.describe('Floating Cam E2E Tests', () => {
  let electronApp: ElectronApplication;
  let window: Page;

  test.beforeAll(async () => {
    // Launch Electron app
    electronApp = await electron.launch({
      args: ['dist/main.js'],
      cwd: '.',
    });

    // Get the first window
    window = await electronApp.firstWindow();
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('should launch application successfully', async () => {
    expect(electronApp).toBeTruthy();
    expect(window).toBeTruthy();
  });

  test('should have correct window title', async () => {
    const title = await window.title();
    expect(title).toBe('Floating Cam');
  });

  test('should show video element', async () => {
    const video = window.locator('#video');
    await expect(video).toBeVisible();
  });

  test('should open controls overlay when toggle button is clicked', async () => {
    const toggleBtn = window.locator('#toggleBtn');
    const overlay = window.locator('#controlsOverlay');

    await toggleBtn.click();
    await expect(overlay).toBeVisible();
  });

  test('should close controls overlay when close button is clicked', async () => {
    const closeBtn = window.locator('#closeOverlayBtn');
    const overlay = window.locator('#controlsOverlay');

    await closeBtn.click();
    await expect(overlay).toBeHidden();
  });

  test('should toggle circle mode', async () => {
    const toggleBtn = window.locator('#toggleBtn');
    const circleBtn = window.locator('#circleBtn');
    const body = window.locator('body');

    // Open controls
    await toggleBtn.click();
    
    // Click circle button
    await circleBtn.click();
    
    // Check if circle class is added
    await expect(body).toHaveClass(/circle/);
    
    // Click again to toggle off
    await circleBtn.click();
    
    // Check if circle class is removed
    await expect(body).not.toHaveClass(/circle/);
  });

  test('should change border radius', async () => {
    const toggleBtn = window.locator('#toggleBtn');
    const radiusRange = window.locator('#radiusRange');
    const radiusValue = window.locator('#radiusValue');

    // Open controls
    await toggleBtn.click();
    
    // Change radius
    await radiusRange.fill('25');
    
    // Check if value is updated
    await expect(radiusValue).toHaveText('25%');
  });
});