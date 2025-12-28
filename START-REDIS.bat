@echo off
echo ========================================
echo Starting Redis
echo ========================================
echo.

REM Check if Docker is available
docker --version >nul 2>&1
if %errorlevel% == 0 (
    echo Docker found! Starting Redis with Docker...
    echo.
    
    REM Check if Redis container already exists
    docker ps -a --filter "name=redis" --format "{{.Names}}" | findstr /C:"redis" >nul 2>&1
    if %errorlevel% == 0 (
        echo Redis container exists, starting it...
        docker start redis
        if %errorlevel% == 0 (
            echo.
            echo ✓ Redis started successfully!
            echo Redis is now running on port 6379
            pause
            exit /b 0
        ) else (
            echo.
            echo ✗ Failed to start Redis container
            echo Trying to create a new one...
        )
    )
    
    REM Create and start Redis container
    echo Creating Redis container...
    docker run -d -p 6379:6379 --name redis redis >nul 2>&1
    if %errorlevel% == 0 (
        echo.
        echo ✓ Redis started successfully!
        echo Redis is now running on port 6379
        pause
        exit /b 0
    ) else (
        echo.
        echo ✗ Failed to start Redis with Docker
        echo Make sure Docker Desktop is running
        pause
        exit /b 1
    )
)

REM Check for Redis installation
if exist "C:\Program Files\Redis\redis-server.exe" (
    echo Found Redis, starting it...
    start "Redis" "C:\Program Files\Redis\redis-server.exe"
    timeout /t 3 /nobreak >nul
    echo.
    echo ✓ Redis should be starting...
    echo Check the Redis window that opened
    pause
    exit /b 0
)

echo.
echo ✗ Redis not found and Docker is not available!
echo.
echo OPTION 1 - Install Docker (Recommended):
echo 1. Go to: https://www.docker.com/products/docker-desktop
echo 2. Download and install Docker Desktop
echo 3. Start Docker Desktop
echo 4. Then run this script again
echo.
echo OPTION 2 - Install Redis for Windows:
echo 1. Go to: https://github.com/tporadowski/redis/releases
echo 2. Download redis-x64-xxx.zip
echo 3. Extract and run redis-server.exe
echo.
pause

