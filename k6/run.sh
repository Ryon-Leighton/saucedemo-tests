#!/bin/sh
set -e

case "${K6_TEST:-smoke}" in
  all)
    k6 run --summary-export /scripts/out/smoke-summary.json /scripts/smoke.js
    k6 run --summary-export /scripts/out/small-load-summary.json /scripts/small-load.js
    ;;
  smoke|load)
    k6 run --summary-export "/scripts/out/${K6_TEST}-summary.json" "/scripts/${K6_TEST}.js"
    ;;
  *)
    echo "Unknown K6_TEST='${K6_TEST}'. Use: smoke | small-load | all" >&2
    exit 2
    ;;
esac
