#!/bin/bash
if ! command -v tsc &> /dev/null; then
  echo "❌ TypeScript compiler not found. Run: npm install typescript --save-dev"
  exit 1
fi
echo "✅ TypeScript is installed. Ready to deploy."
