# Fixed: Yarn Permission Error

## Problem
You were seeing: `Error: spawn EPERM` when using `yarn`

## Solution
**Use `npm` instead of `yarn`** - All startup scripts have been updated.

## How to Start Services

### Option 1: Use the Batch Files (Easiest)
Double-click these files in Windows Explorer:
- `start-api.bat` - Starts API Backend (port 8080)
- `start-user.bat` - Starts User Frontend (port 8081)  
- `start-admin.bat` - Starts Admin Frontend (port 8082)

### Option 2: Manual Start in PowerShell

**Terminal 1 - API Backend:**
```powershell
cd xscorts-2.1.0\api
npm run start:dev
```

**Terminal 2 - User Frontend:**
```powershell
cd xscorts-2.1.0\user
npm run dev
```

**Terminal 3 - Admin Frontend:**
```powershell
cd xscorts-2.1.0\admin
npm run dev
```

## Important Prerequisites

Before the backend will work, you need:

1. **MongoDB** running on `localhost:27017`
   - Check if running: Look for MongoDB service in Windows Services
   - If not installed: Download from https://www.mongodb.com/try/download/community

2. **Redis** running on `localhost:6379`
   - Windows: Use Docker or WSL, or download from:
     - https://github.com/microsoftarchive/redis/releases
     - Or use: `docker run -d -p 6379:6379 redis`

3. **Run Database Migrations** (first time only):
```powershell
cd xscorts-2.1.0\api
npm run migrate
```

## Access URLs

Once all services are running:
- **User Site**: http://localhost:8081
- **Admin Panel**: http://localhost:8082
- **API Docs**: http://localhost:8080/apidocs

## Troubleshooting

### If services don't start:
1. Check MongoDB is running
2. Check Redis is running  
3. Look at the terminal output for specific error messages
4. Ensure dependencies are installed: `npm install --legacy-peer-deps` in each folder

### If you see connection errors:
- **MongoDB connection error**: Start MongoDB service
- **Redis connection error**: Start Redis service
- **Port already in use**: Change ports in `.env` files or stop conflicting services

## All Fixed Issues

✅ Fixed yarn permission error - use npm instead
✅ Fixed Redis config typo (REDIS_PRIFIX → REDIS_PREFIX)
✅ Fixed RedisIoAdapter configuration
✅ Updated .env files for localhost development
✅ Created npm-based startup scripts

