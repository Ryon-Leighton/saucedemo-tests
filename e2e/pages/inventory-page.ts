import { Page, expect } from '@playwright/test';

export const InventoryPage = (page: Page) => {
  const swagLabsHeader = page.locator('.app_logo'); 

  const assertOnPage = async () => {
    await expect(swagLabsHeader).toBeVisible();
  };

  return {
    assertOnPage
  };
};
