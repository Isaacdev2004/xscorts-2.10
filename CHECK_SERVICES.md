# How to Check MongoDB & Redis Status

## Quick Check Script

Run the PowerShell script:
```powershell
cd xscorts-2.1.0
powershell -ExecutionPolicy Bypass -File check-services.ps1
```

This will check:
- ✓ If MongoDB process is running
- ✓ If MongoDB port 27017 is accessible
- ✓ If Redis process is running  
- ✓ If Redis port 6379 is accessible

## Manual Checks

### Check MongoDB

**Method 1: Check Windows Service**
```powershell
Get-Service -Name "*mongo*"
```
If MongoDB is installed as a service, you'll see it listed.

**Method 2: Check if Port is Open**
```powershell
Test-NetConnection -ComputerName localhost -Port 27017
```
Should show `TcpTestSucceeded : True`

**Method 3: Check Running Process**
```powershell
Get-Process -Name "mongod" -ErrorAction SilentlyContinue
```

**Method 4: Test Connection (if MongoDB client is installed)**
```powershell
cd api
node ../test-mongodb.js
```

### Check Redis

**Method 1: Check if Port is Open**
```powershell
Test-NetConnection -ComputerName localhost -Port 6379
```
Should show `TcpTestSucceeded : True`

**Method 2: Check Running Process**
```powershell
Get-Process | Where-Object { $_.ProcessName -like "*redis*" }
```

**Method 3: Test Connection**
```powershell
cd api
node ../test-redis.js
```

**Method 4: If Redis CLI is installed**
```bash
redis-cli ping
```
Should return: `PONG`

## Starting Services

### Start MongoDB

**If installed as Windows Service:**
```powershell
Start-Service MongoDB
```

**If installed manually:**
```powershell
# Navigate to MongoDB bin directory
cd "C:\Program Files\MongoDB\Server\7.0\bin"
.\mongod.exe
```

**Or check MongoDB installation path:**
```powershell
Get-Command mongod -ErrorAction SilentlyContinue
```

### Start Redis

**Option 1: Using Docker (Recommended for Windows)**
```powershell
docker run -d -p 6379:6379 --name redis redis
```

**Option 2: Using WSL (Windows Subsystem for Linux)**
```bash
wsl
sudo service redis-server start
```

**Option 3: Download Redis for Windows**
- Download from: https://github.com/microsoftarchive/redis/releases
- Or use: https://github.com/tporadowski/redis/releases
- Run `redis-server.exe`

**Option 4: Check if Redis is running as service**
```powershell
Get-Service -Name "*redis*"
```

## Expected Results

### ✅ MongoDB Working:
```
✓ MongoDB process is running
✓ MongoDB is listening on port 27017
✓ MongoDB connection successful!
```

### ✅ Redis Working:
```
✓ Redis is listening on port 6379
✓ Redis connection successful!
✓ Redis PING response: PONG
```

## Troubleshooting

### MongoDB Not Running?

1. **Check if MongoDB is installed:**
   ```powershell
   Get-Command mongod -ErrorAction SilentlyContinue
   ```

2. **Install MongoDB if missing:**
   - Download: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

3. **Start MongoDB manually:**
   ```powershell
   # Find MongoDB installation
   $mongoPath = (Get-Command mongod -ErrorAction SilentlyContinue).Source
   if ($mongoPath) {
       & $mongoPath
   }
   ```

### Redis Not Running?

1. **Check if Docker is running:**
   ```powershell
   docker ps
   ```

2. **Start Redis with Docker:**
   ```powershell
   docker run -d -p 6379:6379 --name redis redis
   ```

3. **Or install Redis for Windows:**
   - https://github.com/tporadowski/redis/releases
   - Download and run `redis-server.exe`

4. **Check WSL (if using):**
   ```powershell
   wsl --list
   wsl -d Ubuntu
   sudo service redis-server status
   ```

## Quick Test Commands

Run these from the `api` folder:

```powershell
# Test MongoDB
node ../test-mongodb.js

# Test Redis  
node ../test-redis.js
```

Both scripts will show clear success/failure messages!

