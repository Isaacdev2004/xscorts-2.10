@echo off
title Starting XScorts Application
color 0A
cls
echo.
echo ============================================================
echo   STARTING XSCORTS APPLICATION
echo ============================================================
echo.

REM Check and start MongoDB
echo [1/5] Checking MongoDB...
powershell -Command "try { $result = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue -ErrorAction Stop; if (-not $result.TcpTestSucceeded) { $svc = Get-Service -Name '*mongo*' -ErrorAction SilentlyContinue; if ($svc) { Start-Service $svc.Name -ErrorAction SilentlyContinue; Start-Sleep -Seconds 3 } } } catch {}"
timeout /t 2 /nobreak >nul
powershell -Command "$mongo = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; if ($mongo.TcpTestSucceeded) { Write-Host '  ✓ MongoDB is running' -ForegroundColor Green } else { Write-Host '  ✗ MongoDB is not running' -ForegroundColor Red }"

REM Check and start Redis
echo [2/5] Checking Redis...
powershell -Command "try { $result = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue -ErrorAction Stop; if (-not $result.TcpTestSucceeded) { $svc = Get-Service -Name '*redis*' -ErrorAction SilentlyContinue; if ($svc) { Start-Service $svc.Name -ErrorAction SilentlyContinue; Start-Sleep -Seconds 3 } } } catch {}"
timeout /t 2 /nobreak >nul
powershell -Command "$redis = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; if ($redis.TcpTestSucceeded) { Write-Host '  ✓ Redis is running' -ForegroundColor Green } else { Write-Host '  ✗ Redis is not running' -ForegroundColor Red }"

echo.
echo [3/5] Starting API Backend...
start "API Backend - Port 8080" cmd /k "cd /d %~dp0api && echo API Backend Starting... && npm run start:dev"
timeout /t 3 /nobreak >nul

echo [4/5] Starting User Frontend...
start "User Frontend - Port 8081" cmd /k "cd /d %~dp0user && echo User Frontend Starting... && npm run dev"
timeout /t 3 /nobreak >nul

echo [5/5] Starting Admin Frontend...
start "Admin Frontend - Port 8082" cmd /k "cd /d %~dp0admin && echo Admin Frontend Starting... && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo   APPLICATION STARTED!
echo ============================================================
echo.
echo Three windows have opened - keep them all open!
echo.
echo Wait about 30 seconds, then open your browser:
echo.
echo   User Site:    http://localhost:8081
echo   Admin Panel:  http://localhost:8082
echo.
echo ============================================================
echo.
pause

