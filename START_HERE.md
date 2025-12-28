# XScorts Application Setup Guide

## Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v14+ recommended)
2. **MongoDB** - Running locally on default port (27017) or update MONGO_URI in `.env`
3. **Redis** - Running locally on default port (6379) or update REDIS_HOST/REDIS_PORT in `.env`
4. **Yarn** or **npm** package manager

## Quick Start

### 1. Install Dependencies

If you encounter permission errors, try:
```bash
# For API
cd xscorts-2.1.0/api
npm install --legacy-peer-deps

# For User Frontend
cd xscorts-2.1.0/user
npm install --legacy-peer-deps

# For Admin Frontend
cd xscorts-2.1.0/admin
npm install --legacy-peer-deps
```

### 2. Environment Configuration

Environment files have been created from examples:
- `api/.env` - Backend API configuration
- `user/.env` - User frontend configuration  
- `admin/.env` - Admin frontend configuration

**Important**: Update these files with your MongoDB and Redis connection details if not using defaults.

### 3. Database Setup

Run migrations to set up the database:
```bash
cd xscorts-2.1.0/api
yarn migrate
# or
npm run migrate
```

### 4. Start Services

**Terminal 1 - Start API Backend:**
```bash
cd xscorts-2.1.0/api
yarn start:dev
# or
npm run start:dev
```
API will run on: http://localhost:8080

**Terminal 2 - Start User Frontend:**
```bash
cd xscorts-2.1.0/user
yarn dev
# or
npm run dev
```
User site will run on: http://localhost:8081

**Terminal 3 - Start Admin Frontend:**
```bash
cd xscorts-2.1.0/admin
yarn dev
# or
npm run dev
```
Admin panel will run on: http://localhost:8082

## Fixed Issues

1. ✅ Fixed Redis configuration typo (REDIS_PRIFIX → REDIS_PREFIX)
2. ✅ Fixed RedisIoAdapter to use direct config import
3. ✅ Updated .env files with localhost URLs for local development

## Troubleshooting

### Permission Errors During Install
- Run terminal as Administrator
- Or use: `npm install --legacy-peer-deps`

### MongoDB Connection Errors
- Ensure MongoDB is running: `mongod` or check Windows services
- Verify MONGO_URI in `api/.env` matches your MongoDB setup

### Redis Connection Errors  
- Ensure Redis is running
- On Windows, you may need to install Redis separately or use Docker
- Verify REDIS_HOST and REDIS_PORT in `api/.env`

### Port Already in Use
- Change ports in respective `.env` files
- Or stop services using those ports

## API Documentation

Once the API is running, visit:
- Swagger docs: http://localhost:8080/apidocs (development mode only)

