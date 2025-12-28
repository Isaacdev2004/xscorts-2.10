@echo off
echo ========================================
echo Checking MongoDB and Redis Status
echo ========================================
echo.

REM Check MongoDB
echo Checking MongoDB (port 27017)...
powershell -Command "try { $result = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue -ErrorAction Stop; if ($result.TcpTestSucceeded) { Write-Host '✓ MongoDB is RUNNING' -ForegroundColor Green } else { Write-Host '✗ MongoDB is NOT running' -ForegroundColor Red } } catch { Write-Host '✗ MongoDB is NOT running' -ForegroundColor Red }"

echo.

REM Check Redis
echo Checking Redis (port 6379)...
powershell -Command "try { $result = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue -ErrorAction Stop; if ($result.TcpTestSucceeded) { Write-Host '✓ Redis is RUNNING' -ForegroundColor Green } else { Write-Host '✗ Redis is NOT running' -ForegroundColor Red } } catch { Write-Host '✗ Redis is NOT running' -ForegroundColor Red }"

echo.
echo ========================================
echo.
pause

