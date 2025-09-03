# SauceDemo Tests

Playwright + BDD (Gherkin) UI tests, lightweight API checks, and k6 smoke/load tests. Run locally with Node or Docker; CI runs in GitHub Actions and publishes artifacts.

## Structure

- `e2e/` – BDD features, steps, support, and generated specs
  - `features/**/*.feature`
  - `steps/**/*.ts`
  - `generated/` (output from `playwright-bdd`)
- `e2e/api/` – API smoke tests
- `playwright.config.ts` – BDD/UI config
- `playwright.api.config.ts` – API-only config
- `e2e/Dockerfile` – Playwright test image
- `docker-compose.tests.yml` – local one-command run (API → E2E → k6)
- `k6/` – k6 JS tests (`smoke.js`, `load.js`) and `run.sh`
- Tooling: `.prettierrc.json`, `.prettierignore`, `.husky/`

## Why these tools

- **Playwright** – fast, reliable browser + API testing.
- **playwright-bdd** – Gherkin syntax + step definitions for readable E2E.
- **k6** – quick performance smoke/load checks in CI or locally.
- **Docker** – consistent, hermetic runtime (same image locally/CI).
- **Prettier + Husky (+ lint-staged)** – formatting and commit-time guardrails.

## Requirements

- Node 18+ and npm, or Docker 24+
- Optional: `.env` for local `BASE_URL`, etc. (this is in the repo and just used as a POC)

## Install (Node)

```bash
npm ci
# Generate BDD specs (once or per run)
npx bddgen
```

## Run tests locally

### Node

```bash
# API tests
npx playwright test -c playwright.api.config.ts

# BDD/UI tests (Chromium)
npx bddgen && npx playwright test -c playwright.config.ts
```

### Docker (uses `e2e/Dockerfile`)

```bash
# Build once
docker build -f e2e/Dockerfile -t pw-tests:local .

# API
docker run --rm -e BASE_URL="https://www.saucedemo.com/"   -v "$PWD/playwright-report-api:/app/playwright-report"   -v "$PWD/test-results-api:/app/test-results"   pw-tests:local npx playwright test -c playwright.api.config.ts

# BDD/UI
docker run --rm -e BASE_URL="https://www.saucedemo.com/"   -v "$PWD/playwright-report-e2e:/app/playwright-report"   -v "$PWD/test-results-e2e:/app/test-results"   pw-tests:local sh -lc "npx bddgen && npx playwright test -c playwright.config.ts"
```

### Docker Compose (sequential: API → E2E → k6)

```bash
docker compose -f docker-compose.tests.yml up --build --abort-on-container-exit --exit-code-from k6-all k6-all
```

Reports write to the mounted folders in the repo.

## k6 (performance smoke)

- Tests in `k6/*.js` (e.g., `smoke.js`, `load.js`).
- Runner `k6/run.sh` executes **all** `*.js` by default and writes JSON summaries to `k6/out/`.

Run standalone (no build):

```bash
mkdir -p k6/out && chmod +x k6/run.sh
docker run --rm --entrypoint /bin/sh   -e BASE_URL="https://www.saucedemo.com/" -e K6_TEST=all   -v "$PWD/k6:/scripts" grafana/k6:latest /scripts/run.sh
```

## CI (GitHub Actions)

The workflow:

1. Build Playwright image from `e2e/Dockerfile`.
2. Run **API** tests → upload `playwright-report-api/` + `test-results-api/`.
3. Run **BDD/UI** tests → upload `playwright-report-e2e/` + `test-results-e2e/`.
4. Run **k6** via official image + `k6/run.sh` → upload `k6/out/`.
5. Fail the job if any suite fails.

To run the workflow manually, go to the repo’s Actions tab, pick the Playwright Tests workflow in the left sidebar, then click Run workflow (top-right), choose the branch (e.g. main), and hit Run workflow.

**Artifacts**

- Playwright HTML: `playwright-report-*`
- JUnit XML: `test-results-*` (Playwright) and `k6/out/*-summary.json` (k6 JSON; JUnit/HTML optional via `handleSummary`)

## Dev tooling

- **Prettier**: `npm run format` / `format:check`
- **Husky (v10-safe)**: pre-commit blocks `.only` and warns on `@skip`.
- **lint-staged** (optional): format staged files only.

## .gitignore highlights

```
playwright-report*/
test-results*/
e2e/generated/
k6/out/
node_modules/
```

## Troubleshooting

- **Compose GREP warning** → Add `GREP=` to `.env` or remove usage.
