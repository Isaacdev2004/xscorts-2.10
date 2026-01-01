# Database Setup Guide

## ⚠️ Important: Database is NOT Included in Repository

The database (MongoDB) and Redis are **NOT included** in the GitHub repository. You need to set up your own database instances.

## What's Included in the Repository

✅ **Database Migration Files** - These set up the database schema and initial data
- Located in: `api/migrations/`
- These files create tables, indexes, and seed initial data
- Run with: `npm run migrate` (in the `api` folder)

✅ **Database Configuration** - Connection settings
- Located in: `config-example/env/api.env`
- You need to create your own `.env` file with your database connection string

## What You Need to Set Up

### 1. MongoDB Database

You have **two options**:

#### Option A: MongoDB Atlas (Cloud - Recommended for Production)
**Free tier available!**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (click "Build a Database")
4. Choose the free tier (M0 Sandbox)
5. Create a database user (username/password)
6. Add your IP address to the whitelist (or use `0.0.0.0/0` for all IPs - less secure)
7. Click "Connect" → "Connect your application"
8. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/xscorts`)

**Cost:** Free tier → $9/month for production

#### Option B: Local MongoDB (For Development)
1. Download MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Default connection: `mongodb://localhost/xscorts`

### 2. Redis Database

You have **two options**:

#### Option A: Redis Cloud (Recommended for Production)
**Free tier available!**

1. Go to [redis.com/try-free](https://redis.com/try-free)
2. Create a free account
3. Create a database (one click)
4. Copy the connection URL

**Cost:** Free tier → $10/month for production

#### Option B: Local Redis (For Development)
**Windows:**
- Use Docker: `docker run -d -p 6379:6379 redis`
- Or download from: [github.com/microsoftarchive/redis/releases](https://github.com/microsoftarchive/redis/releases)

**Mac/Linux:**
```bash
brew install redis
redis-server
```

## Setup Steps

### Step 1: Create Your Database Connection String

1. Copy `config-example/env/api.env` to `api/.env`
2. Update the `MONGO_URI` with your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/xscorts
   ```
   Or for local:
   ```
   MONGO_URI=mongodb://localhost/xscorts
   ```

3. Update Redis settings:
   ```
   REDIS_HOST=your-redis-host
   REDIS_PORT=6379
   ```

### Step 2: Run Database Migrations

This will create all the database tables and seed initial data:

```bash
cd api
npm run migrate
```

This will:
- Create all database collections (tables)
- Set up indexes
- Create default admin user
- Seed default categories, settings, and menus
- Create email templates

### Step 3: Verify Database Setup

After running migrations, you should have:
- ✅ Database collections created
- ✅ Default admin user (check the migration file for credentials)
- ✅ Default categories and settings
- ✅ Email templates

## Default Admin User

After running migrations, check the file:
`api/migrations/1618901984235-admin-user.js`

This will show you the default admin credentials (usually):
- Email: `admin@example.com`
- Password: Check the migration file

**⚠️ Important:** Change the admin password immediately after first login!

## For Production Deployment (Render.com, Railway, etc.)

### MongoDB Atlas Setup:
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Add to Render/Railway environment variables as `MONGO_URI`

### Redis Cloud Setup:
1. Create Redis Cloud account
2. Create database
3. Get connection URL
4. Add to Render/Railway environment variables as `REDIS_HOST` and `REDIS_PORT`

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your `MONGO_URI` is correct
- For MongoDB Atlas: Make sure your IP is whitelisted
- Check MongoDB service is running (for local)

### "Cannot connect to Redis"
- Check `REDIS_HOST` and `REDIS_PORT` are correct
- For Redis Cloud: Check the connection URL
- Check Redis service is running (for local)

### "Migration failed"
- Make sure MongoDB is accessible
- Check you have write permissions
- Try running migrations again: `npm run migrate`

## Summary

✅ **Migration files ARE included** - These set up your database schema
❌ **Database itself is NOT included** - You need to create your own MongoDB and Redis instances
✅ **Configuration templates ARE included** - Copy and update with your connection strings

**Next Steps:**
1. Set up MongoDB (Atlas or local)
2. Set up Redis (Cloud or local)
3. Update `.env` file with connection strings
4. Run `npm run migrate` to create database schema
5. Start your application!

