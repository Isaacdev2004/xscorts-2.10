@echo off
title Restarting Application
color 0A
cls
echo.
echo ============================================================
echo   RESTARTING APPLICATION
echo ============================================================
echo.

echo [1/3] Stopping old application windows...
taskkill /FI "WINDOWTITLE eq *Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq *Frontend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq *API*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq *User*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq *Admin*" /F >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✓ Old windows closed

echo.
echo [2/3] Starting API Backend...
start "API Backend - Port 8080" cmd /k "cd /d %~dp0api && echo === API Backend === && echo Starting on port 8080... && npm run start:dev"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontends...
start "User Frontend - Port 8081" cmd /k "cd /d %~dp0user && echo === User Frontend === && echo Starting on port 8081... && npm run dev"
timeout /t 3 /nobreak >nul

start "Admin Frontend - Port 8082" cmd /k "cd /d %~dp0admin && echo === Admin Frontend === && echo Starting on port 8082... && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo   APPLICATION RESTARTED!
echo ============================================================
echo.
echo ✓ 3 windows have opened
echo.
echo Wait 30-60 seconds, then try:
echo   http://localhost:8081
echo   http://localhost:8082
echo.
echo Check the windows for any error messages.
echo.
pause

