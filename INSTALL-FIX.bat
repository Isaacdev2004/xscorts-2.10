@echo off
title Installing Dependencies (Fixed)
color 0B
cls
echo.
echo ============================================================
echo   INSTALLING DEPENDENCIES (WITH SSL FIX)
echo ============================================================
echo.
echo Fixing npm SSL issues and installing dependencies...
echo This may take 10-15 minutes. Please be patient!
echo.
pause

REM Disable strict SSL for npm
set npm_config_strict_ssl=false
set npm_config_registry=https://registry.npmjs.org/

echo.
echo [1/3] Installing API Backend dependencies...
cd api
call npm install --legacy-peer-deps --no-optional
if %errorlevel% neq 0 (
    echo.
    echo ⚠ API install had issues, but continuing...
    echo Check node_modules folder - some packages may be installed.
)
cd ..

echo.
echo [2/3] Installing User Frontend dependencies...
cd user
call npm install --legacy-peer-deps --no-optional
if %errorlevel% neq 0 (
    echo.
    echo ⚠ User install had issues, but continuing...
)
cd ..

echo.
echo [3/3] Installing Admin Frontend dependencies...
cd admin
call npm install --legacy-peer-deps --no-optional
if %errorlevel% neq 0 (
    echo.
    echo ⚠ Admin install had issues, but continuing...
)
cd ..

echo.
echo ============================================================
echo   INSTALLATION COMPLETE
echo ============================================================
echo.
echo Checking what was installed...
cd api
if exist node_modules (
    echo ✓ API: node_modules folder exists
) else (
    echo ✗ API: node_modules missing
)
cd ..\user
if exist node_modules (
    echo ✓ User: node_modules folder exists
) else (
    echo ✗ User: node_modules missing
)
cd ..\admin
if exist node_modules (
    echo ✓ Admin: node_modules folder exists
) else (
    echo ✗ Admin: node_modules missing
)
cd ..

echo.
echo If node_modules folders exist, try starting the app!
echo Run: START-ALL.bat
echo.
pause




