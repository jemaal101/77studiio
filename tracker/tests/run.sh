#!/bin/sh
# Runs every test here against the source page.
#   KL_LIVE=<read_db snapshot dir>   use the real rows (never committed)
#   KL_PAGE=<built html>             test a built or publish file instead
cd "$(dirname "$0")" || exit 1
export NODE_PATH="${NODE_PATH:-/opt/node22/lib/node_modules}"
fail=0
for f in *.js; do
  case "$f" in fixture.js) continue;; esac
  echo "== $f"; node "$f" || fail=1
done
exit $fail
