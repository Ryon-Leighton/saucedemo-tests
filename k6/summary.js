import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary, jUnit } from 'https://jslib.k6.io/k6-summary/0.0.4/index.js';

export function makeHandleSummary(name) {
  const base = name || __ENV.K6_NAME || 'k6';
  return (data) => ({
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    [`/scripts/out/${base}-summary.json`]: JSON.stringify(data, null, 2),
    [`/scripts/out/${base}-report.html`]: htmlReport(data, { title: `k6 report – ${base}` }),
    [`/scripts/out/${base}-junit.xml`]: jUnit(data),
  });
}
