import { test, expect } from '@playwright/test';

test.use({ baseURL: 'https://www.saucedemo.com/' });

test('root returns HTML shell', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status()).toBe(200);
});

test('favicon is served', async ({ request }) => {
  const res = await request.get('/favicon.ico');
  expect(res.status()).toBe(200);
});
