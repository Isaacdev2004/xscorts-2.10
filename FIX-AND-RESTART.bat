@echo off
title Fixing Issues and Restarting
color 0E
cls
echo.
echo ============================================================
echo   FIXING ISSUES AND RESTARTING
echo ============================================================
echo.

echo [1/4] Stopping old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✓ Stopped

echo.
echo [2/4] Fixing API Backend (creating dist folder)...
cd api
if not exist dist mkdir dist
cd ..
echo ✓ Fixed

echo.
echo [3/4] Installing missing dependencies...
cd user
call npm install ts-node --save-dev --legacy-peer-deps >nul 2>&1
cd ..\admin
call npm install ts-node --save-dev --legacy-peer-deps >nul 2>&1
cd ..
echo ✓ Installed

echo.
echo [4/4] Starting all services...
start "API Backend - Port 8080" cmd /k "cd /d %~dp0api && echo ======================================== && echo   API BACKEND - Port 8080 && echo ======================================== && echo. && npm run start:dev"
timeout /t 3 /nobreak >nul

start "User Frontend - Port 8081" cmd /k "cd /d %~dp0user && echo ======================================== && echo   USER FRONTEND - Port 8081 && echo ======================================== && echo. && npm run dev"
timeout /t 3 /nobreak >nul

start "Admin Frontend - Port 8082" cmd /k "cd /d %~dp0admin && echo ======================================== && echo   ADMIN FRONTEND - Port 8082 && echo ======================================== && echo. && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo   FIXED AND RESTARTED!
echo ============================================================
echo.
echo ✓ Fixed API Backend mkdir issue
echo ✓ Installed missing ts-node for frontends
echo ✓ Restarted all services
echo.
echo Wait 30-60 seconds for compilation...
echo Then check the windows for "ready" or "listening" messages.
echo.
pause

