import http from 'k6/http';
import { check, sleep } from 'k6';
import { makeHandleSummary } from './summary.js';

export const options = { vus: 1, iterations: 1 };
const BASE_URL = __ENV.BASE_URL || 'https://www.saucedemo.com/';

export default function () {
  const res = http.get(BASE_URL);
  check(res, {
    'status 200': (r) => r.status === 200,
    'HTML shell present': (r) => String(r.body).includes('<div id="root"></div>'),
    'title contains Swag Labs': (r) => String(r.body).toLowerCase().includes('swag labs'),
  });
  sleep(1);
}

export function handleSummary(data) {
  return makeHandleSummary('smoke')(data);
}
