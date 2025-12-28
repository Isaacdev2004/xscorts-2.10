# Complete Render.com Deployment Guide for XScorts

This guide will walk you through deploying your XScorts application on Render.com step-by-step.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code is already at: `https://github.com/Isaacdev2004/xscorts-2.10.git`
2. **Render Account** - Sign up at [render.com](https://render.com) (free)
3. **MongoDB Atlas Account** - For database (free tier available)
4. **Redis Account** - For caching (free tier available)

---

## 🗄️ Step 1: Set Up Databases First

### 1.1 MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new **Free Cluster** (M0)
4. Choose a cloud provider and region (closest to you)
5. Click **"Create Cluster"** (takes 3-5 minutes)
6. Once created:
   - Click **"Connect"** → **"Connect your application"**
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - **IMPORTANT:** Replace `<password>` with your database password
   - **IMPORTANT:** Add database name at the end: `/xscorts?retryWrites=true&w=majority`
   - Final format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/xscorts?retryWrites=true&w=majority`
7. Click **"Database Access"** → Add a database user:
   - Username: `xscorts-admin`
   - Password: (create a strong password - save it!)
   - Database User Privileges: **Read and write to any database**
8. Click **"Network Access"** → **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)

**Save your MongoDB connection string!** You'll need it later.

---

### 1.2 Redis Setup

**Option A: Redis Cloud (Recommended - Free Tier)**

1. Go to [redis.com/try-free](https://redis.com/try-free)
2. Sign up for free account
3. Create a new database:
   - Name: `xscorts-redis`
   - Region: Choose closest to you
   - Memory: 30MB (free tier)
4. Once created, click on your database
5. Copy the **Public endpoint** (looks like: `redis-xxxxx.c1.us-east-1-1.ec2.cloud.redislabs.com:12345`)
6. Copy the **Default user password** (or create one)

**Save your Redis connection details!**

**Option B: Render Redis (Alternative)**

1. In Render dashboard, click **"New +"** → **"Redis"**
2. Name: `xscorts-redis`
3. Plan: **Free** (or paid if needed)
4. Click **"Create Redis"**
5. Copy the **Internal Redis URL** (for services on Render)
6. Copy the **External Redis URL** (if needed)

---

## 🚀 Step 2: Deploy API Backend

### 2.1 Create API Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository:
   - Click **"Connect account"** if not connected
   - Select repository: `Isaacdev2004/xscorts-2.10`
4. Configure the service:

**Basic Settings:**
- **Name:** `xscorts-api`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `api`
- **Runtime:** `Node`
- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Start Command:** `npm run start:prod`

**Environment Variables:**
Click **"Add Environment Variable"** and add these one by one:

```
NODE_ENV=production
HTTP_PORT=8080
TOKEN_SECRET=your-very-secret-random-string-here-change-this
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/xscorts?retryWrites=true&w=majority
REDIS_HOST=redis-xxxxx.c1.us-east-1-1.ec2.cloud.redislabs.com
REDIS_PORT=12345
REDIS_DB=0
REDIS_PREFIX=xscorts_queue
MAILER_CONCURRENCY=2
TEMPLATE_DIR=templates
DOMAIN=your-domain.com
BASE_URL=https://xscorts-api.onrender.com
USER_URL=https://xscorts-user.onrender.com
EMAIL_VERIFIED_SUCCESS_URL=https://xscorts-user.onrender.com/auth/email-verified-success
FFMPEG_CPU_LIMIT=
```

**Important Notes:**
- Replace `TOKEN_SECRET` with a long random string (use a password generator)
- Replace `MONGO_URI` with your MongoDB Atlas connection string
- Replace `REDIS_HOST` and `REDIS_PORT` with your Redis details
- Replace `DOMAIN` with your actual domain (or use Render subdomain)
- `BASE_URL` and `USER_URL` will be your Render service URLs (update after creating services)

5. Click **"Create Web Service"**

### 2.2 Run Database Migrations

After the API service is deployed:

1. Go to your API service in Render dashboard
2. Click **"Shell"** tab (or use **"Manual Deploy"** → **"Run Shell Command"**)
3. Run:
```bash
cd api
npm install --legacy-peer-deps
npm run migrate
```

This will set up your database schema and create the admin user.

---

## 🎨 Step 3: Deploy User Frontend

### 3.1 Create User Frontend Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect to same repository: `Isaacdev2004/xscorts-2.10`
3. Configure:

**Basic Settings:**
- **Name:** `xscorts-user`
- **Region:** Same as API
- **Branch:** `main`
- **Root Directory:** `user`
- **Runtime:** `Node`
- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Start Command:** `npm run start`

**Environment Variables:**
```
NODE_ENV=production
PORT=8081
API_ENDPOINT=https://xscorts-api.onrender.com
NEXT_PUBLIC_API_ENDPOINT=https://xscorts-api.onrender.com
NEXT_PUBLIC_SOCKET_ENDPOINT=https://xscorts-api.onrender.com
```

**Important:** 
- Replace `xscorts-api.onrender.com` with your actual API service URL
- You'll get the URL after API service is created (format: `https://xscorts-api.onrender.com`)

4. Click **"Create Web Service"**

---

## 🔧 Step 4: Deploy Admin Frontend

### 4.1 Create Admin Frontend Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect to same repository: `Isaacdev2004/xscorts-2.10`
3. Configure:

**Basic Settings:**
- **Name:** `xscorts-admin`
- **Region:** Same as API
- **Branch:** `main`
- **Root Directory:** `admin`
- **Runtime:** `Node`
- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Start Command:** `npm run start`

**Environment Variables:**
```
NODE_ENV=production
PORT=8082
API_ENDPOINT=https://xscorts-api.onrender.com
NEXT_PUBLIC_API_ENDPOINT=https://xscorts-api.onrender.com
NEXT_PUBLIC_SITE_URL=https://xscorts-user.onrender.com
NEXT_PUBLIC_MAX_SIZE_IMAGE=5
NEXT_PUBLIC_MAX_SIZE_FILE=100
NEXT_PUBLIC_MAX_SIZE_TEASER=500
NEXT_PUBLIC_MAX_SIZE_VIDEO=5000
NEXT_PUBLIC_BUILD_VERSION=3.0.3
```

**Important:**
- Replace `xscorts-api.onrender.com` with your actual API service URL
- Replace `xscorts-user.onrender.com` with your actual User service URL

4. Click **"Create Web Service"**

---

## 🔄 Step 5: Update Environment Variables

After all services are created, you need to update the URLs:

### 5.1 Update API Service Environment Variables

1. Go to your API service (`xscorts-api`)
2. Click **"Environment"** tab
3. Update these variables with your actual Render URLs:
   - `BASE_URL=https://xscorts-api.onrender.com` (your API URL)
   - `USER_URL=https://xscorts-user.onrender.com` (your User frontend URL)
   - `EMAIL_VERIFIED_SUCCESS_URL=https://xscorts-user.onrender.com/auth/email-verified-success`

### 5.2 Update User Frontend Environment Variables

1. Go to your User service (`xscorts-user`)
2. Click **"Environment"** tab
3. Update:
   - `API_ENDPOINT=https://xscorts-api.onrender.com`
   - `NEXT_PUBLIC_API_ENDPOINT=https://xscorts-api.onrender.com`
   - `NEXT_PUBLIC_SOCKET_ENDPOINT=https://xscorts-api.onrender.com`

### 5.3 Update Admin Frontend Environment Variables

1. Go to your Admin service (`xscorts-admin`)
2. Click **"Environment"** tab
3. Update:
   - `API_ENDPOINT=https://xscorts-api.onrender.com`
   - `NEXT_PUBLIC_API_ENDPOINT=https://xscorts-api.onrender.com`
   - `NEXT_PUBLIC_SITE_URL=https://xscorts-user.onrender.com`

**After updating environment variables, Render will automatically redeploy your services.**

---

## 🔐 Step 6: Configure Redis Connection

### 6.1 If Using Redis Cloud (External)

In your API service environment variables, use:
```
REDIS_HOST=redis-xxxxx.c1.us-east-1-1.ec2.cloud.redislabs.com
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
REDIS_DB=0
REDIS_PREFIX=xscorts_queue
```

### 6.2 If Using Render Redis (Internal)

1. Create Redis service in Render (if not done)
2. In API service environment variables, use:
```
REDIS_HOST=your-redis-service-name.onrender.com
REDIS_PORT=6379
REDIS_PASSWORD=(from Render Redis service)
REDIS_DB=0
REDIS_PREFIX=xscorts_queue
```

**Note:** You may need to update the Redis connection code if it doesn't support password authentication. Check `api/src/config/redis.ts`.

---

## 📧 Step 7: Configure Email (Optional but Recommended)

For email functionality, you need SMTP settings:

1. Go to your API service → **"Environment"** tab
2. Add these variables (if not already in your code):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

**For Gmail:**
- Use an App Password (not your regular password)
- Enable 2FA first, then generate App Password

**For other providers:**
- Check your email provider's SMTP settings

---

## ✅ Step 8: Verify Deployment

### 8.1 Check Service Status

1. Go to Render dashboard
2. All three services should show **"Live"** status
3. Click on each service to see logs

### 8.2 Test Your Application

1. **API Backend:**
   - Visit: `https://xscorts-api.onrender.com`
   - Should show API response or Swagger docs

2. **User Frontend:**
   - Visit: `https://xscorts-user.onrender.com`
   - Should show your website homepage

3. **Admin Frontend:**
   - Visit: `https://xscorts-admin.onrender.com`
   - Should show admin login page

### 8.3 Test Admin Login

1. Go to admin frontend
2. Default admin credentials (from migration):
   - Email: `admin@localhost`
   - Username: `admin`
   - Password: (check migration file `api/migrations/1618901984235-admin-user.js`)

**Important:** Change admin password immediately after first login!

---

## 🔧 Step 9: Custom Domain (Optional)

### 9.1 Add Custom Domain

1. Go to each service → **"Settings"** → **"Custom Domains"**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Follow DNS instructions:
   - Add CNAME record pointing to Render service
   - Wait for DNS propagation (5-30 minutes)
5. Render will automatically provision SSL certificate

### 9.2 Update Environment Variables

After adding custom domains, update:
- `DOMAIN=yourdomain.com`
- `BASE_URL=https://api.yourdomain.com`
- `USER_URL=https://yourdomain.com`
- Update frontend `NEXT_PUBLIC_API_ENDPOINT` and `NEXT_PUBLIC_SITE_URL`

---

## 📊 Step 10: Monitoring & Logs

### 10.1 View Logs

1. Go to any service in Render dashboard
2. Click **"Logs"** tab
3. View real-time logs and errors

### 10.2 Set Up Alerts

1. Go to service → **"Settings"** → **"Alerts"**
2. Add email alerts for:
   - Service down
   - High error rate
   - High memory usage

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
- Check build logs for errors
- Ensure `--legacy-peer-deps` is in build command
- Check Node version (should be 14+)

### Issue: API Can't Connect to MongoDB

**Solution:**
- Verify MongoDB connection string is correct
- Check MongoDB Network Access allows all IPs (0.0.0.0/0)
- Verify database user has correct permissions
- Check MongoDB Atlas cluster is running

### Issue: API Can't Connect to Redis

**Solution:**
- Verify Redis host and port are correct
- Check Redis password (if required)
- For Redis Cloud, ensure database is active
- Check firewall settings

### Issue: Frontend Can't Connect to API

**Solution:**
- Verify `NEXT_PUBLIC_API_ENDPOINT` is correct
- Check API service is running
- Verify CORS settings in API (if applicable)
- Check browser console for errors

### Issue: Services Go to Sleep (Free Tier)

**Solution:**
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- Upgrade to paid plan for always-on services ($7/month per service)

---

## 💰 Cost Estimate

### Free Tier (Development/Testing):
- **API Service:** Free (sleeps after inactivity)
- **User Frontend:** Free (sleeps after inactivity)
- **Admin Frontend:** Free (sleeps after inactivity)
- **MongoDB Atlas:** Free (512MB storage)
- **Redis Cloud:** Free (30MB)
- **Total:** $0/month

### Paid Tier (Production):
- **API Service:** $7/month (always on)
- **User Frontend:** $7/month (always on)
- **Admin Frontend:** $7/month (always on)
- **MongoDB Atlas:** $9/month (M10 cluster)
- **Redis Cloud:** $10/month (100MB)
- **Total:** ~$40/month

---

## 📝 Quick Reference: All Environment Variables

### API Service (.env)
```bash
NODE_ENV=production
HTTP_PORT=8080
TOKEN_SECRET=your-secret-here
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/xscorts?retryWrites=true&w=majority
REDIS_HOST=redis-host.com
REDIS_PORT=12345
REDIS_DB=0
REDIS_PREFIX=xscorts_queue
MAILER_CONCURRENCY=2
TEMPLATE_DIR=templates
DOMAIN=yourdomain.com
BASE_URL=https://xscorts-api.onrender.com
USER_URL=https://xscorts-user.onrender.com
EMAIL_VERIFIED_SUCCESS_URL=https://xscorts-user.onrender.com/auth/email-verified-success
FFMPEG_CPU_LIMIT=
```

### User Frontend (.env)
```bash
NODE_ENV=production
PORT=8081
API_ENDPOINT=https://xscorts-api.onrender.com
NEXT_PUBLIC_API_ENDPOINT=https://xscorts-api.onrender.com
NEXT_PUBLIC_SOCKET_ENDPOINT=https://xscorts-api.onrender.com
```

### Admin Frontend (.env)
```bash
NODE_ENV=production
PORT=8082
API_ENDPOINT=https://xscorts-api.onrender.com
NEXT_PUBLIC_API_ENDPOINT=https://xscorts-api.onrender.com
NEXT_PUBLIC_SITE_URL=https://xscorts-user.onrender.com
NEXT_PUBLIC_MAX_SIZE_IMAGE=5
NEXT_PUBLIC_MAX_SIZE_FILE=100
NEXT_PUBLIC_MAX_SIZE_TEASER=500
NEXT_PUBLIC_MAX_SIZE_VIDEO=5000
NEXT_PUBLIC_BUILD_VERSION=3.0.3
```

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created and connection string saved
- [ ] Redis database created and connection details saved
- [ ] API service created with all environment variables
- [ ] User frontend service created with all environment variables
- [ ] Admin frontend service created with all environment variables
- [ ] Database migrations run successfully
- [ ] All service URLs updated in environment variables
- [ ] All services showing "Live" status
- [ ] User frontend accessible and working
- [ ] Admin frontend accessible and login working
- [ ] API endpoints responding correctly
- [ ] Custom domains configured (if applicable)
- [ ] Email/SMTP configured (if needed)
- [ ] Admin password changed from default

---

## 🎉 You're Done!

Your XScorts application should now be live on Render.com!

**Your URLs:**
- API: `https://xscorts-api.onrender.com`
- User Site: `https://xscorts-user.onrender.com`
- Admin Panel: `https://xscorts-admin.onrender.com`

**Next Steps:**
1. Test all functionality
2. Change default admin password
3. Configure custom domain (optional)
4. Set up monitoring and alerts
5. Review and optimize performance

---

## 📞 Need Help?

- **Render Documentation:** [render.com/docs](https://render.com/docs)
- **Render Support:** [render.com/support](https://render.com/support)
- **MongoDB Atlas Docs:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Redis Cloud Docs:** [docs.redislabs.com](https://docs.redislabs.com)

