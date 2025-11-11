#!/bin/bash
set -e

echo "Starting deployment..."

# Clean install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Build the application
echo "Building application..."
NODE_ENV=production npm run build

# Copy necessary files
echo "Copying files..."
cp -r .next ./
cp -r public ./ 2>/dev/null || true
cp server.js ./
cp package.json ./
cp package-lock.json ./ 2>/dev/null || true

echo "✅ Deployment completed successfully"
