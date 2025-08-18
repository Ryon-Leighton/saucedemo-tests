import { createBdd } from 'playwright-bdd';
import { test, expect } from './../fixtures';

const { Given, When, Then } = createBdd(test);

// --- Background step ---
Given('I navigate to the login page', async ({ page }) => {
  await page.goto('/');
});

// --- Login actions ---
When('I login with {string} and password {string}', async ({ loginPage }, user: string, pass: string) => {
  await loginPage.login(user, pass);
});

When('I login with {string} and {string}', async ({ loginPage }, user: string, pass: string) => {
  await loginPage.login(user, pass);
});

// --- Inventory page checks ---
Then('I should be on the inventory page', async ({ inventoryPage }) => {
  await inventoryPage.assertOnPage();
});

// --- Error checks ---
Then('I should see a login error containing {string}', async ({ loginPage }, msg: string) => {
  await expect(loginPage.error).toBeVisible();
  await expect(loginPage.error).toContainText(msg);
});
