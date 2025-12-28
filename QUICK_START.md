# Quick Start Guide

## Application Started! 🚀

All three services have been started in separate PowerShell windows:

1. **API Backend** - Running on http://localhost:8080
2. **User Frontend** - Running on http://localhost:8081  
3. **Admin Frontend** - Running on http://localhost:8082

## Access the Application

- **User Site**: Open http://localhost:8081 in your browser
- **Admin Panel**: Open http://localhost:8082 in your browser
- **API Docs**: Open http://localhost:8080/apidocs (Swagger documentation)

## Important Notes

### Prerequisites Required:
- **MongoDB** must be running on localhost:27017 (or update `api/.env`)
- **Redis** must be running on localhost:6379 (or update `api/.env`)

### If Services Don't Start:
1. Check MongoDB is running: `mongod` or check Windows Services
2. Check Redis is running (may need Docker or separate installation)
3. Check the PowerShell windows for error messages
4. Ensure dependencies are installed: `yarn install` or `npm install --legacy-peer-deps` in each folder

### Database Setup:
Run migrations before first use:
```bash
cd api
yarn migrate
```

This will create the admin user:
- Email: admin@localhost
- Username: admin
- Password: (set during first login or check migration scripts)

## Startup Scripts

I've created batch files for easy startup:
- `start-api.bat` - Start API backend
- `start-user.bat` - Start user frontend
- `start-admin.bat` - Start admin frontend

## Backend Fixes Applied

✅ Fixed Redis configuration typo (REDIS_PRIFIX → REDIS_PREFIX)
✅ Fixed RedisIoAdapter to properly load Redis config
✅ Updated all .env files with localhost URLs for local development

## Troubleshooting

If you see connection errors:
1. **MongoDB Connection Error**: Start MongoDB service
2. **Redis Connection Error**: Start Redis service or install Redis for Windows
3. **Port Already in Use**: Stop other services using ports 8080, 8081, or 8082

Check the PowerShell windows for detailed error messages!

