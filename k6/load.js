import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { makeHandleSummary } from './summary.js';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
    homepage_duration: ['p(95)<1500'],
  },
  scenarios: {
    tiny_ramp: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 5 },
        { duration: '30s', target: 5 },
        { duration: '15s', target: 0 },
      ],
      gracefulRampDown: '5s',
    },
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://www.saucedemo.com/';
const homepage = new Trend('homepage_duration');

export default function () {
  const res = http.get(BASE_URL, { headers: { 'cache-control': 'no-cache' } });
  homepage.add(res.timings.duration);
  check(res, { 'status 200': (r) => r.status === 200, 'HTML shell present': (r) => String(r.body).includes('<div id="root"></div>') });
  sleep(1);
}

export function handleSummary(data) {
  return makeHandleSummary('load')(data);
}
