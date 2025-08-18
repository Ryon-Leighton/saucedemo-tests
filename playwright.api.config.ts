import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e/api',
  testMatch: ['**/*.spec.*', '**/*.test.*'],

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,

  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Reporters
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report-api', open: 'never' }],
    ['junit', { outputFile: 'reports/junit-api.xml' }],
  ],

  // No browsers, but we still use the Playwright request context
  use: {
    baseURL: process.env.BASE_URL
  }
});
