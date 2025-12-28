@echo off
title Starting Complete Application
color 0A
cls
echo.
echo ============================================================
echo   STARTING COMPLETE APPLICATION
echo ============================================================
echo.

echo [1/4] Stopping old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✓ Old processes stopped

echo.
echo [2/4] Starting API Backend (Port 8080)...
start "API Backend - Port 8080" cmd /k "cd /d %~dp0api && echo ======================================== && echo   API BACKEND - Port 8080 && echo ======================================== && echo. && npm run start:dev"
timeout /t 3 /nobreak >nul

echo [3/4] Starting User Frontend (Port 8081)...
start "User Frontend - Port 8081" cmd /k "cd /d %~dp0user && echo ======================================== && echo   USER FRONTEND - Port 8081 && echo ======================================== && echo. && npm run dev"
timeout /t 3 /nobreak >nul

echo [4/4] Starting Admin Frontend (Port 8082)...
start "Admin Frontend - Port 8082" cmd /k "cd /d %~dp0admin && echo ======================================== && echo   ADMIN FRONTEND - Port 8082 && echo ======================================== && echo. && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo   ALL SERVICES STARTED!
echo ============================================================
echo.
echo ✓ API Backend: Starting on port 8080
echo ✓ User Frontend: Starting on port 8081
echo ✓ Admin Frontend: Starting on port 8082
echo.
echo Three windows have opened. Please wait 30-60 seconds
echo for compilation to complete.
echo.
echo Then open your browser:
echo   → User Site:    http://localhost:8081
echo   → Admin Panel:  http://localhost:8082
echo.
echo Check the windows for "listening" or "ready" messages.
echo.
pause



