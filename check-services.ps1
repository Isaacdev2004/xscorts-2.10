# MongoDB and Redis Status Checker
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking MongoDB and Redis Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✓ MongoDB process is running (PID: $($mongoProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "✗ MongoDB process not found" -ForegroundColor Red
}

# Try to connect to MongoDB port
try {
    $mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue -ErrorAction Stop
    if ($mongoTest.TcpTestSucceeded) {
        Write-Host "✓ MongoDB is listening on port 27017" -ForegroundColor Green
    } else {
        Write-Host "✗ MongoDB port 27017 is not accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Cannot connect to MongoDB on port 27017" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Check Redis
Write-Host "Checking Redis..." -ForegroundColor Yellow
$redisProcess = Get-Process -Name "redis-server" -ErrorAction SilentlyContinue
if ($redisProcess) {
    Write-Host "✓ Redis process is running (PID: $($redisProcess.Id))" -ForegroundColor Green
} else {
    # Check for redis-cli or other redis processes
    $redisProcess2 = Get-Process | Where-Object { $_.ProcessName -like "*redis*" } -ErrorAction SilentlyContinue
    if ($redisProcess2) {
        Write-Host "✓ Redis-related process found: $($redisProcess2.ProcessName)" -ForegroundColor Green
    } else {
        Write-Host "✗ Redis process not found" -ForegroundColor Red
    }
}

# Try to connect to Redis port
try {
    $redisTest = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue -ErrorAction Stop
    if ($redisTest.TcpTestSucceeded) {
        Write-Host "✓ Redis is listening on port 6379" -ForegroundColor Green
    } else {
        Write-Host "✗ Redis port 6379 is not accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Cannot connect to Redis on port 6379" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Final summary
$mongoOk = $false
$redisOk = $false

try {
    $mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    $mongoOk = $mongoTest.TcpTestSucceeded
} catch {
    $mongoOk = $false
}

try {
    $redisTest = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    $redisOk = $redisTest.TcpTestSucceeded
} catch {
    $redisOk = $false
}

if ($mongoOk -and $redisOk) {
    Write-Host "✓ Both MongoDB and Redis are working!" -ForegroundColor Green
    Write-Host "  You can start the application now." -ForegroundColor Green
} elseif ($mongoOk) {
    Write-Host "⚠ MongoDB is OK, but Redis needs to be started" -ForegroundColor Yellow
} elseif ($redisOk) {
    Write-Host "⚠ Redis is OK, but MongoDB needs to be started" -ForegroundColor Yellow
} else {
    Write-Host "✗ Both MongoDB and Redis need to be started" -ForegroundColor Red
}

Write-Host ""
