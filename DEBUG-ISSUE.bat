@echo off
title Debugging Application Issue
color 0E
cls
echo.
echo ============================================================
echo   DEBUGGING APPLICATION ISSUE
echo ============================================================
echo.

echo [Step 1] Checking MongoDB...
powershell -Command "$mongo = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; if ($mongo.TcpTestSucceeded) { Write-Host '✓ MongoDB: RUNNING' -ForegroundColor Green } else { Write-Host '✗ MongoDB: NOT RUNNING' -ForegroundColor Red }"

echo.
echo [Step 2] Checking Redis...
powershell -Command "$redis = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; if ($redis.TcpTestSucceeded) { Write-Host '✓ Redis: RUNNING' -ForegroundColor Green } else { Write-Host '✗ Redis: NOT RUNNING' -ForegroundColor Red }"

echo.
echo [Step 3] Checking Application Ports...
powershell -Command "$ports = @(8080, 8081, 8082); foreach ($p in $ports) { $test = Test-NetConnection -ComputerName localhost -Port $p -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; if ($test.TcpTestSucceeded) { Write-Host \"✓ Port $p : LISTENING\" -ForegroundColor Green } else { Write-Host \"✗ Port $p : NOT LISTENING\" -ForegroundColor Red } }"

echo.
echo [Step 4] Checking Node.js processes...
powershell -Command "$procs = Get-Process -Name 'node' -ErrorAction SilentlyContinue; if ($procs) { Write-Host \"✓ Found $($procs.Count) Node.js process(es)\" -ForegroundColor Green } else { Write-Host '✗ No Node.js processes running!' -ForegroundColor Red }"

echo.
echo [Step 5] Checking Dependencies...
cd api
if exist node_modules (
    echo ✓ API dependencies installed
) else (
    echo ✗ API dependencies NOT installed!
    echo   Run: cd api ^&^& npm install
)
cd ..\user
if exist node_modules (
    echo ✓ User dependencies installed
) else (
    echo ✗ User dependencies NOT installed!
    echo   Run: cd user ^&^& npm install
)
cd ..\admin
if exist node_modules (
    echo ✓ Admin dependencies installed
) else (
    echo ✗ Admin dependencies NOT installed!
    echo   Run: cd admin ^&^& npm install
)
cd ..

echo.
echo ============================================================
echo   SUMMARY
echo ============================================================
echo.
echo Check the application windows for error messages!
echo.
echo Common issues:
echo   1. Dependencies not installed - Run npm install
echo   2. MongoDB connection error - Check MongoDB is running
echo   3. Port already in use - Close other applications
echo   4. Compilation errors - Check the windows for details
echo.
pause

