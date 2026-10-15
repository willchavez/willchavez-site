#!/bin/sh
# Build the Astro app, then copy the legacy site files (still at the repo root) into the output
# without overwriting anything Astro made. Output: app/dist
set -e
cd "$(dirname "$0")"
npm install
npm run build
for f in CNAME favicon.ico portfolio.html projects.html fonts img css js dist portfolio blog; do
  [ -e "../$f" ] && cp -rn "../$f" dist/ || true
done
