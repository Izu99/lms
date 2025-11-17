#!/bin/bash

# 🔍 Build Verification Script
# This script verifies that both backend and frontend can build successfully

set -e  # Exit on error

echo "🚀 Starting Build Verification..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "server" ] || [ ! -d "client" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Backend Build
echo "📦 Building Backend..."
echo "-------------------"
cd server

if [ ! -d "node_modules" ]; then
    print_warning "Installing backend dependencies..."
    npm install
fi

print_info "Compiling TypeScript..."
if npm run build; then
    print_success "Backend build successful!"
else
    print_error "Backend build failed!"
    exit 1
fi

cd ..
echo ""

# Frontend Build
echo "📦 Building Frontend..."
echo "--------------------"
cd client

if [ ! -d "node_modules" ]; then
    print_warning "Installing frontend dependencies..."
    npm install
fi

print_info "Building Next.js application..."
if npm run build; then
    print_success "Frontend build successful!"
else
    print_error "Frontend build failed!"
    exit 1
fi

cd ..
echo ""

# Summary
echo "🎉 Build Verification Complete!"
echo "================================"
print_success "Backend: Compiled successfully"
print_success "Frontend: Built successfully"
echo ""
print_info "Your application is ready for production deployment!"
echo ""
echo "Next steps:"
echo "  1. Review environment variables"
echo "  2. Deploy backend to Azure/Vercel"
echo "  3. Deploy frontend to Vercel"
echo "  4. Test in production"
echo ""
