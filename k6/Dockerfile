FROM grafana/k6:latest
WORKDIR /scripts

# Copy JS tests and the runner
COPY k6/smoke.js /scripts/smoke.js
COPY k6/load.js /scripts/load.js
COPY k6/run.sh /scripts/run.sh

# Output folder for JSON summaries
RUN mkdir -p /scripts/out && chmod +x /scripts/run.sh

# Defaults (override at runtime if you want)
ENV BASE_URL="https://www.saucedemo.com/"
ENV K6_TEST="all"

# Override k6's default entrypoint so we can run multiple scripts if needed
ENTRYPOINT ["/bin/sh", "/scripts/run.sh"]
