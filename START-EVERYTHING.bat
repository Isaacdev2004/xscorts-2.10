@echo off
title XScorts Application Starter
color 0A
echo.
echo ============================================================
echo   XSCORTS APPLICATION - SIMPLE STARTUP GUIDE
echo ============================================================
echo.
echo This will help you start everything step by step.
echo.
pause

:MAIN_MENU
cls
echo.
echo ============================================================
echo   MAIN MENU
echo ============================================================
echo.
echo 1. Check if MongoDB and Redis are running
echo 2. Start MongoDB (if installed)
echo 3. Start Redis (using Docker)
echo 4. Start the Application (API + Frontends)
echo 5. View Installation Guide
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto CHECK_STATUS
if "%choice%"=="2" goto START_MONGO
if "%choice%"=="3" goto START_REDIS
if "%choice%"=="4" goto START_APP
if "%choice%"=="5" goto SHOW_GUIDE
if "%choice%"=="6" goto END
goto MAIN_MENU

:CHECK_STATUS
cls
echo.
echo Checking status...
call CHECK-STATUS.bat
pause
goto MAIN_MENU

:START_MONGO
cls
echo.
echo Starting MongoDB...
call START-MONGODB.bat
pause
goto MAIN_MENU

:START_REDIS
cls
echo.
echo Starting Redis...
call START-REDIS.bat
pause
goto MAIN_MENU

:START_APP
cls
echo.
echo ============================================================
echo   Starting Application
echo ============================================================
echo.
echo This will open 3 windows - one for each service.
echo Keep all windows open!
echo.
pause

start "API Backend" cmd /k "cd /d %~dp0api && npm run start:dev"
timeout /t 2 /nobreak >nul

start "User Frontend" cmd /k "cd /d %~dp0user && npm run dev"
timeout /t 2 /nobreak >nul

start "Admin Frontend" cmd /k "cd /d %~dp0admin && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ✓ All services are starting!
echo.
echo Wait about 30 seconds, then open your browser:
echo   - User site: http://localhost:8081
echo   - Admin panel: http://localhost:8082
echo.
pause
goto MAIN_MENU

:SHOW_GUIDE
cls
type SIMPLE-START-GUIDE.txt
pause
goto MAIN_MENU

:END
echo.
echo Goodbye!
timeout /t 2 /nobreak >nul
exit

