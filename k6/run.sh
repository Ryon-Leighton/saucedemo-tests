#!/bin/sh
# K6_TEST=smoke | load | all (default all)
set -eu

SCRIPTS_DIR="/scripts"
OUT_DIR="${SCRIPTS_DIR}/out"
mkdir -p "${OUT_DIR}"

run_one() {
  name="$1"
  file="${SCRIPTS_DIR}/${name}.js"
  if [ ! -f "${file}" ]; then
    echo "⚠️  Skipping '${name}' – not found at ${file}"
    return 0
  fi
  echo "▶️  k6: ${name}"
  # K6_NAME is there if you ever want to key off it inside the test
  K6_NAME="$name" k6 run "${file}"
}

fail=0
case "${K6_TEST:-all}" in
  all)
    found_any=false
    for f in "${SCRIPTS_DIR}"/*.js; do
      [ -e "$f" ] || continue
      base="$(basename "$f" .js)"
      [ "$base" = "run" ] && continue
      run_one "$base" || fail=1
      found_any=true
    done
    [ "$found_any" = true ] || { echo "❌ No k6 scripts found in ${SCRIPTS_DIR}"; exit 2; }
    ;;
  smoke|load)
    run_one "${K6_TEST}" || fail=1
    ;;
  *)
    echo "Unknown K6_TEST='${K6_TEST}'. Use: smoke | load | all" >&2
    exit 2
    ;;
esac

exit $fail
