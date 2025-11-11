#!/bin/bash
set -e

echo "Starting application..."

# Set production environment
export NODE_ENV=production

# Start the server
echo "Starting Node.js server..."
node server.js
