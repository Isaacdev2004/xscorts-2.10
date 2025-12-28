@echo off
title Installing Dependencies
color 0B
cls
echo.
echo ============================================================
echo   INSTALLING ALL DEPENDENCIES
echo ============================================================
echo.
echo This will install dependencies for all 3 parts:
echo   - API Backend
echo   - User Frontend
echo   - Admin Frontend
echo.
echo This may take 5-10 minutes. Please wait...
echo.
pause

echo.
echo [1/3] Installing API Backend dependencies...
cd api
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo.
    echo ✗ API dependencies installation failed!
    echo Check for errors above.
    pause
    exit /b 1
)
echo ✓ API dependencies installed!
cd ..

echo.
echo [2/3] Installing User Frontend dependencies...
cd user
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo.
    echo ✗ User dependencies installation failed!
    echo Check for errors above.
    pause
    exit /b 1
)
echo ✓ User dependencies installed!
cd ..

echo.
echo [3/3] Installing Admin Frontend dependencies...
cd admin
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo.
    echo ✗ Admin dependencies installation failed!
    echo Check for errors above.
    pause
    exit /b 1
)
echo ✓ Admin dependencies installed!
cd ..

echo.
echo ============================================================
echo   ALL DEPENDENCIES INSTALLED!
echo ============================================================
echo.
echo ✓ API Backend dependencies: INSTALLED
echo ✓ User Frontend dependencies: INSTALLED
echo ✓ Admin Frontend dependencies: INSTALLED
echo.
echo Now you can start the application!
echo Run: START-ALL.bat
echo.
pause




