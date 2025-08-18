import { Page } from '@playwright/test';

export const LoginPage = (page: Page) => {
  const username = page.locator('#user-name');
  const password = page.locator('#password');
  const loginButton = page.locator('#login-button');
  const error = page.locator('h3[data-test="error"]');

  const login = async (user: string, pass: string) => {
    await username.fill(user);
    await password.fill(pass);
    await loginButton.click();
  };

  return { error, login };
};
