#!/usr/bin/env bash
set -euo pipefail

# Build TSX plugin for production deployment
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$ROOT_DIR/dist"

# Clean and create dist directory
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Install dependencies if package.json exists
if [ -f "${ROOT_DIR}/package.json" ]; then
  echo "Installing plugin dependencies..."
  cd "${ROOT_DIR}"
  npm install --silent
fi

# Build with esbuild for production
# External packages: react, react-dom/client, react/jsx-runtime (provided by host)
# All other dependencies will be bundled into the plugin
npx esbuild "${ROOT_DIR}/src/index.ts" \
  --bundle \
  --format=iife \
  --platform=browser \
  --jsx=automatic \
  --external:react \
  --external:react-dom/client \
  --external:react/jsx-runtime \
  --minify \
  --sourcemap \
  --outfile="${DIST_DIR}/index.js"

echo "Built production plugin to ${DIST_DIR}/index.js"
