@echo off
title Fixing Connection Issue
color 0E
cls
echo.
echo ============================================================
echo   FIXING CONNECTION ISSUE
echo ============================================================
echo.
echo The site can't be reached because MongoDB isn't running.
echo.
echo Let's fix this step by step...
echo.
pause

echo.
echo [Step 1] Checking MongoDB...
echo.

REM Check if MongoDB service exists
sc query MongoDB >nul 2>&1
if %errorlevel% == 0 (
    echo Found MongoDB service!
    echo Starting it...
    net start MongoDB
    if %errorlevel% == 0 (
        echo.
        echo ✓ MongoDB service started!
        timeout /t 3 /nobreak >nul
    ) else (
        echo.
        echo ✗ Failed to start MongoDB service
        echo.
        echo You need to run this as Administrator!
        echo Right-click this file and choose "Run as Administrator"
        pause
        exit /b 1
    )
) else (
    echo MongoDB service not found.
    echo.
    echo Checking for MongoDB installation...
    
    REM Check common MongoDB locations
    if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" (
        echo Found MongoDB 7.0!
        echo Starting it...
        start "MongoDB" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
        timeout /t 3 /nobreak >nul
        echo ✓ MongoDB started!
    ) else if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" (
        echo Found MongoDB 6.0!
        echo Starting it...
        start "MongoDB" "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
        timeout /t 3 /nobreak >nul
        echo ✓ MongoDB started!
    ) else if exist "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" (
        echo Found MongoDB 5.0!
        echo Starting it...
        start "MongoDB" "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
        timeout /t 3 /nobreak >nul
        echo ✓ MongoDB started!
    ) else (
        echo.
        echo ✗ MongoDB not found in common locations!
        echo.
        echo Please start MongoDB manually:
        echo 1. Open Windows Services (Windows+R, type: services.msc)
        echo 2. Find "MongoDB" service
        echo 3. Right-click → Start
        echo.
        echo OR find MongoDB where you installed it and run mongod.exe
        echo.
        pause
        exit /b 1
    )
)

echo.
echo [Step 2] Waiting for MongoDB to be ready...
timeout /t 5 /nobreak >nul

echo.
echo [Step 3] Verifying MongoDB is running...
powershell -Command "$mongo = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; if ($mongo.TcpTestSucceeded) { Write-Host '✓ MongoDB is RUNNING!' -ForegroundColor Green } else { Write-Host '✗ MongoDB is still not accessible' -ForegroundColor Red; Write-Host '  Wait a few more seconds and try again' -ForegroundColor Yellow }"

echo.
echo [Step 4] Restarting Application...
echo.
echo Closing old application windows...
taskkill /FI "WINDOWTITLE eq API Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq User Frontend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Admin Frontend*" /F >nul 2>&1
timeout /t 2 /nobreak >nul

echo Starting application again...
start "API Backend - Port 8080" cmd /k "cd /d %~dp0api && echo API Backend Starting... && npm run start:dev"
timeout /t 3 /nobreak >nul

start "User Frontend - Port 8081" cmd /k "cd /d %~dp0user && echo User Frontend Starting... && npm run dev"
timeout /t 3 /nobreak >nul

start "Admin Frontend - Port 8082" cmd /k "cd /d %~dp0admin && echo Admin Frontend Starting... && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo   DONE!
echo ============================================================
echo.
echo ✓ MongoDB should be running now
echo ✓ Application windows have been restarted
echo.
echo Wait 30-60 seconds, then try:
echo   http://localhost:8081
echo   http://localhost:8082
echo.
echo If it still doesn't work, check the application windows
echo for error messages.
echo.
pause

