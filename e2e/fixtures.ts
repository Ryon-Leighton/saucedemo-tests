import { test as base } from 'playwright-bdd';
import { LoginPage } from './pages/login-page';
import { InventoryPage } from './pages/inventory-page';

type Fixtures = {
  loginPage: ReturnType<typeof LoginPage>;
  inventoryPage: ReturnType<typeof InventoryPage>;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(InventoryPage(page));
  },
});

export const expect = base.expect;