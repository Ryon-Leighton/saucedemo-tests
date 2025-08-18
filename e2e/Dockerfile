FROM mcr.microsoft.com/playwright:v1.54.2-noble

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY e2e ./e2e
COPY playwright*.config.* ./

CMD ["sh", "-lc", "npx bddgen && npx playwright test"]

