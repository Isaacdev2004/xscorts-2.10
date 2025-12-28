@echo off
title Starting Fixed Application
color 0A
cls
echo.
echo ============================================================
echo   STARTING APPLICATION (FIXED VERSION)
echo ============================================================
echo.

echo Stopping old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo [1/3] Starting API Backend...
cd api
if not exist dist mkdir dist
start "API Backend - Port 8080" cmd /k "cd /d %~dp0api && echo ======================================== && echo   API BACKEND - Port 8080 && echo ======================================== && echo. && npm run start:dev"
cd ..
timeout /t 3 /nobreak >nul

echo [2/3] Starting User Frontend...
cd user
start "User Frontend - Port 8081" cmd /k "cd /d %~dp0user && echo ======================================== && echo   USER FRONTEND - Port 8081 && echo ======================================== && echo. && npm run dev"
cd ..
timeout /t 3 /nobreak >nul

echo [3/3] Starting Admin Frontend...
cd admin
start "Admin Frontend - Port 8082" cmd /k "cd /d %~dp0admin && echo ======================================== && echo   ADMIN FRONTEND - Port 8082 && echo ======================================== && echo. && npm run dev"
cd ..

echo.
echo ============================================================
echo   ALL SERVICES STARTED!
echo ============================================================
echo.
echo Wait 30-60 seconds for compilation...
echo Then check the windows for "ready" or "listening" messages.
echo.
pause

