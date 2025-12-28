@echo off
echo ========================================
echo Starting MongoDB
echo ========================================
echo.

REM Check if MongoDB service exists
sc query MongoDB >nul 2>&1
if %errorlevel% == 0 (
    echo Found MongoDB service, starting it...
    net start MongoDB
    if %errorlevel% == 0 (
        echo.
        echo ✓ MongoDB started successfully!
        echo MongoDB is now running on port 27017
        pause
        exit /b 0
    ) else (
        echo.
        echo ✗ Failed to start MongoDB service
        echo You may need to run this as Administrator
        pause
        exit /b 1
    )
)

REM Try to find MongoDB in common locations
echo Checking for MongoDB installation...
if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" (
    echo Found MongoDB, starting it...
    start "MongoDB" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
    timeout /t 3 /nobreak >nul
    echo.
    echo ✓ MongoDB should be starting...
    echo Check the MongoDB window that opened
    pause
    exit /b 0
)

if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" (
    echo Found MongoDB, starting it...
    start "MongoDB" "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
    timeout /t 3 /nobreak >nul
    echo.
    echo ✓ MongoDB should be starting...
    echo Check the MongoDB window that opened
    pause
    exit /b 0
)

echo.
echo ✗ MongoDB not found!
echo.
echo Please install MongoDB:
echo 1. Go to: https://www.mongodb.com/try/download/community
echo 2. Download and install MongoDB Community Server
echo 3. During installation, choose "Install MongoDB as a Service"
echo 4. Then run this script again
echo.
pause

