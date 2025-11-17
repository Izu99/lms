# 🔍 Build Verification Script (PowerShell)
# This script verifies that both backend and frontend can build successfully

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Build Verification..." -ForegroundColor Cyan
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

function Print-Info {
    param($message)
    Write-Host "ℹ️  $message" -ForegroundColor Yellow
}

# Check if we're in the right directory
if (-not (Test-Path "server") -or -not (Test-Path "client")) {
    Print-Error "Please run this script from the project root directory"
    exit 1
}

# Backend Build
Write-Host "📦 Building Backend..." -ForegroundColor Cyan
Write-Host "-------------------"
Set-Location server

if (-not (Test-Path "node_modules")) {
    Print-Warning "Installing backend dependencies..."
    npm install
}

Print-Info "Compiling TypeScript..."
try {
    npm run build
    Print-Success "Backend build successful!"
} catch {
    Print-Error "Backend build failed!"
    Set-Location ..
    exit 1
}

Set-Location ..
Write-Host ""

# Frontend Build
Write-Host "📦 Building Frontend..." -ForegroundColor Cyan
Write-Host "--------------------"
Set-Location client

if (-not (Test-Path "node_modules")) {
    Print-Warning "Installing frontend dependencies..."
    npm install
}

Print-Info "Building Next.js application..."
try {
    npm run build
    Print-Success "Frontend build successful!"
} catch {
    Print-Error "Frontend build failed!"
    Set-Location ..
    exit 1
}

Set-Location ..
Write-Host ""

# Summary
Write-Host "🎉 Build Verification Complete!" -ForegroundColor Green
Write-Host "================================"
Print-Success "Backend: Compiled successfully"
Print-Success "Frontend: Built successfully"
Write-Host ""
Print-Info "Your application is ready for production deployment!"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Review environment variables"
Write-Host "  2. Deploy backend to Azure/Vercel"
Write-Host "  3. Deploy frontend to Vercel"
Write-Host "  4. Test in production"
Write-Host ""
