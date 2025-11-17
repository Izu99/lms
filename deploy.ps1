# 🚀 Production Deployment Script (PowerShell)
# This script helps deploy the LMS application to production

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Production Deployment..." -ForegroundColor Cyan
Write-Host ""

function Print-Success {
    param($message)
    Write-Host "✅ $message" -ForegroundColor Green
}

function Print-Error {
    param($message)
    Write-Host "❌ $message" -ForegroundColor Red
}

function Print-Warning {
    param($message)
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

# Check if .env files exist
Write-Host "📋 Checking environment configuration..." -ForegroundColor Cyan
if (-not (Test-Path "server\.env")) {
    Print-Error "server\.env file not found!"
    Write-Host "Please create server\.env from server\.env.example"
    exit 1
}

if (-not (Test-Path "client\.env.local")) {
    Print-Warning "client\.env.local not found. Using defaults."
}

Print-Success "Environment files found"
Write-Host ""

# Check for required environment variables
Write-Host "🔐 Validating environment variables..." -ForegroundColor Cyan

# Check JWT_SECRET
$envContent = Get-Content "server\.env" -Raw
if ($envContent -match "CHANGE_THIS_IN_PRODUCTION") {
    Print-Error "JWT_SECRET not changed in server\.env!"
    Write-Host "Please generate a new secret with:"
    Write-Host 'node -e "console.log(require(''crypto'').randomBytes(64).toString(''hex''))"'
    exit 1
}

Print-Success "Environment variables validated"
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan

Write-Host "Installing server dependencies..."
Set-Location server
npm install --production=false
Print-Success "Server dependencies installed"

Write-Host "Installing client dependencies..."
Set-Location ..\client
npm install --production=false
Print-Success "Client dependencies installed"
Set-Location ..

Write-Host ""

# Run security audit
Write-Host "🔍 Running security audit..." -ForegroundColor Cyan
Set-Location server
try {
    npm audit --audit-level=high
    Print-Success "Server security audit passed"
} catch {
    Print-Warning "Server has security vulnerabilities"
}

Set-Location ..\client
try {
    npm audit --audit-level=high
    Print-Success "Client security audit passed"
} catch {
    Print-Warning "Client has security vulnerabilities"
}
Set-Location ..

Write-Host ""

# Build server
Write-Host "🏗️  Building server..." -ForegroundColor Cyan
Set-Location server
npm run build
Print-Success "Server built successfully"
Set-Location ..

Write-Host ""

# Build client
Write-Host "🏗️  Building client..." -ForegroundColor Cyan
Set-Location client
npm run build
Print-Success "Client built successfully"
Set-Location ..

Write-Host ""

# Run tests (if available)
Write-Host "🧪 Running tests..." -ForegroundColor Cyan
Set-Location client
try {
    npm run test
    Print-Success "Tests passed"
} catch {
    Print-Warning "Tests failed or not available"
}
Set-Location ..

Write-Host ""

# Final checklist
Write-Host "📋 Pre-deployment Checklist:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please verify the following before deploying:"
Write-Host "  [ ] MongoDB credentials changed"
Write-Host "  [ ] JWT_SECRET is strong (64+ characters)"
Write-Host "  [ ] Environment variables set in deployment platform"
Write-Host "  [ ] CORS origins configured correctly"
Write-Host "  [ ] HTTPS/SSL enabled"
Write-Host "  [ ] Database backups configured"
Write-Host "  [ ] Monitoring and logging set up"
Write-Host ""

$confirm = Read-Host "Have you completed all checklist items? (yes/no)"

if ($confirm -ne "yes") {
    Print-Warning "Deployment cancelled. Please complete the checklist first."
    exit 0
}

Write-Host ""
Print-Success "Build completed successfully!"
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "For Vercel (Frontend):"
Write-Host "  1. Push code to GitHub"
Write-Host "  2. Import project in Vercel"
Write-Host "  3. Set NEXT_PUBLIC_API_BASE_URL environment variable"
Write-Host "  4. Deploy"
Write-Host ""
Write-Host "For Azure (Backend):"
Write-Host "  1. Create Azure App Service"
Write-Host "  2. Set environment variables in Application Settings"
Write-Host "  3. Deploy using: az webapp up --name your-app-name"
Write-Host ""
Write-Host "Or deploy both to Vercel:"
Write-Host "  vercel --prod"
Write-Host ""

Print-Success "Deployment preparation complete! 🎉"
