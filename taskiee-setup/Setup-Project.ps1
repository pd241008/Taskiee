# ==============================================================================
# Taskiee - Unified Setup Script
# ==============================================================================
# This script automates the installation of dependencies and directory setup
# for the Taskiee Kanban application.
# ==============================================================================

$errorActionPreference = "Stop"

Write-Host "`n⚡ INITIALIZING TASKIEE SETUP..." -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# 1. Backend Dependency Check & Install
Write-Host "[1/4] Installing Backend Dependencies..." -ForegroundColor Yellow
if (Test-Path "backend") {
    Push-Location backend
    npm install
    Pop-Location
    Write-Host "✔ Backend dependencies synchronized.`n" -ForegroundColor Green
} else {
    Write-Host "✖ backend directory not found. Skipping.`n" -ForegroundColor Red
}

# 2. Frontend Dependency Check & Install
Write-Host "[2/4] Installing Frontend Dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend") {
    Push-Location frontend
    npm install
    Pop-Location
    Write-Host "✔ Frontend dependencies synchronized.`n" -ForegroundColor Green
} else {
    Write-Host "✖ frontend directory not found. Skipping.`n" -ForegroundColor Red
}

# 3. Create Required Data Directories
Write-Host "[3/4] Ensuring Data Persistence Layers..." -ForegroundColor Yellow
$dataPath = "backend/data"
if (!(Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath | Out-Null
    Write-Host "✔ Created $dataPath directory." -ForegroundColor Green
} else {
    Write-Host "✔ $dataPath directory already exists." -ForegroundColor Green
}

# 4. Initialize Mock Data Stores
$usersJson = "$dataPath/users.json"
if (!(Test-Path $usersJson)) {
    "[]" | Out-File $usersJson -Encoding utf8
    Write-Host "✔ Initialized empty user data store ($usersJson).`n" -ForegroundColor Green
} else {
    Write-Host "✔ User data store already exists.`n" -ForegroundColor Green
}

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Cyan
Write-Host "Use 'npm run dev' in both backend and frontend to start development servers." -ForegroundColor Gray
Write-Host "====================================`n" -ForegroundColor Cyan

# Pause if running in a window
if ($Host.Name -eq "ConsoleHost") {
    Read-Host "`nPress Enter to exit..."
}
