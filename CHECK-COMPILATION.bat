@echo off
title Checking Compilation Status
color 0B
cls
echo.
echo ============================================================
echo   CHECKING COMPILATION STATUS
echo ============================================================
echo.

echo Checking ports...
echo.

powershell -Command "$api = Test-NetConnection localhost -Port 8080 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; if ($api.TcpTestSucceeded) { Write-Host '✓ Port 8080 (API): READY' -ForegroundColor Green } else { Write-Host '⏳ Port 8080 (API): Still compiling...' -ForegroundColor Yellow }"

powershell -Command "$user = Test-NetConnection localhost -Port 8081 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; if ($user.TcpTestSucceeded) { Write-Host '✓ Port 8081 (User): READY' -ForegroundColor Green } else { Write-Host '⏳ Port 8081 (User): Still compiling...' -ForegroundColor Yellow }"

powershell -Command "$admin = Test-NetConnection localhost -Port 8082 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; if ($admin.TcpTestSucceeded) { Write-Host '✓ Port 8082 (Admin): READY' -ForegroundColor Green } else { Write-Host '⏳ Port 8082 (Admin): Still compiling...' -ForegroundColor Yellow }"

echo.
echo ============================================================
echo.

powershell -Command "$api = Test-NetConnection localhost -Port 8080 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; $user = Test-NetConnection localhost -Port 8081 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; $admin = Test-NetConnection localhost -Port 8082 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue; if ($api.TcpTestSucceeded -and $user.TcpTestSucceeded -and $admin.TcpTestSucceeded) { Write-Host '✅ ALL SERVICES READY!' -ForegroundColor Green; Write-Host ''; Write-Host 'Open your browser:' -ForegroundColor Cyan; Write-Host '  http://localhost:8081' -ForegroundColor White; Write-Host '  http://localhost:8082' -ForegroundColor White } else { Write-Host '⏳ Still compiling...' -ForegroundColor Yellow; Write-Host 'Wait 30-60 more seconds and run this again.' -ForegroundColor White }"

echo.
pause

