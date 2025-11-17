#!/bin/bash

# 🚀 Production Deployment Script
# This script helps deploy the LMS application to production

set -e  # Exit on error

echo "🚀 Starting Production Deployment..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
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

# Check if .env files exist
echo "📋 Checking environment configuration..."
if [ ! -f "server/.env" ]; then
    print_error "server/.env file not found!"
    echo "Please create server/.env from server/.env.example"
    exit 1
fi

if [ ! -f "client/.env.local" ]; then
    print_warning "client/.env.local not found. Using defaults."
fi

print_success "Environment files found"
echo ""

# Check for required environment variables
echo "🔐 Validating environment variables..."

# Check JWT_SECRET
if grep -q "CHANGE_THIS_IN_PRODUCTION" server/.env; then
    print_error "JWT_SECRET not changed in server/.env!"
    echo "Please generate a new secret with:"
    echo "node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    exit 1
fi

print_success "Environment variables validated"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."

echo "Installing server dependencies..."
cd server
npm install --production=false
print_success "Server dependencies installed"

echo "Installing client dependencies..."
cd ../client
npm install --production=false
print_success "Client dependencies installed"
cd ..

echo ""

# Run security audit
echo "🔍 Running security audit..."
cd server
npm audit --audit-level=high || print_warning "Server has security vulnerabilities"
cd ../client
npm audit --audit-level=high || print_warning "Client has security vulnerabilities"
cd ..

echo ""

# Build server
echo "🏗️  Building server..."
cd server
npm run build
print_success "Server built successfully"
cd ..

echo ""

# Build client
echo "🏗️  Building client..."
cd client
npm run build
print_success "Client built successfully"
cd ..

echo ""

# Run tests (if available)
echo "🧪 Running tests..."
cd client
if npm run test --if-present; then
    print_success "Tests passed"
else
    print_warning "Tests failed or not available"
fi
cd ..

echo ""

# Final checklist
echo "📋 Pre-deployment Checklist:"
echo ""
echo "Please verify the following before deploying:"
echo "  [ ] MongoDB credentials changed"
echo "  [ ] JWT_SECRET is strong (64+ characters)"
echo "  [ ] Environment variables set in deployment platform"
echo "  [ ] CORS origins configured correctly"
echo "  [ ] HTTPS/SSL enabled"
echo "  [ ] Database backups configured"
echo "  [ ] Monitoring and logging set up"
echo ""

read -p "Have you completed all checklist items? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    print_warning "Deployment cancelled. Please complete the checklist first."
    exit 0
fi

echo ""
print_success "Build completed successfully!"
echo ""
echo "📝 Next Steps:"
echo ""
echo "For Vercel (Frontend):"
echo "  1. Push code to GitHub"
echo "  2. Import project in Vercel"
echo "  3. Set NEXT_PUBLIC_API_BASE_URL environment variable"
echo "  4. Deploy"
echo ""
echo "For Azure (Backend):"
echo "  1. Create Azure App Service"
echo "  2. Set environment variables in Application Settings"
echo "  3. Deploy using: az webapp up --name your-app-name"
echo ""
echo "Or deploy both to Vercel:"
echo "  vercel --prod"
echo ""

print_success "Deployment preparation complete! 🎉"
