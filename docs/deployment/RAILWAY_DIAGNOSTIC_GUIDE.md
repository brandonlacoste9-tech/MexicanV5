# 🚂 Railway Database Connection Diagnostic Guide

## 📍 Quick Links

### Your Railway Project

- **Project Dashboard**: https://railway.com/project/ad61359f-e003-47db-9feb-2434b9c266f5
- **OjeaV5 Service**: https://railway.com/project/ad61359f-e003-47db-9feb-2434b9c266f5/service/6c38cd3e-0d5c-4b14-b92c-2f13670bbd21
- **Database Service**: https://railway.com/project/ad61359f-e003-47db-9feb-2434b9c266f5/service/95c3b60e-f0a3-4538-ac07-619dbfb80e44

---

## 🔍 Step-by-Step Diagnostic Checklist

### ✅ STEP 1: Verify DATABASE_URL Environment Variable

1. **Navigate to OjeaV5 Variables**:
   - Go to: https://railway.com/project/ad61359f-e003-47db-9feb-2434b9c266f5/service/6c38cd3e-0d5c-4b14-b92c-2f13670bbd21/variables

2. **Check for DATABASE_URL**:

   ```
   ✅ Should exist: DATABASE_URL
   ✅ Should start with: postgresql://
   ✅ Should contain: railway.app
   ❌ Should NOT contain: supabase.co
   ```

3. **Example of CORRECT DATABASE_URL**:

   ```
   postgresql://postgres:PASSWORD@postgres-database.railway.app:5432/railway
   ```

4. **Example of WRONG DATABASE_URL (Supabase)**:
   ```
   ❌ postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres
   ```

### ✅ STEP 2: Get the Correct DATABASE_URL from Database Service

1. **Navigate to Database Service**:
   - Go to: https://railway.com/project/ad61359f-e003-47db-9feb-2434b9c266f5/service/95c3b60e-f0a3-4538-ac07-619dbfb80e44

2. **Find the Variables Tab**:
   - Click **"Variables"** in the top menu

3. **Copy DATABASE_URL**:
   - Look for the variable named `DATABASE_URL`
   - Click the **copy icon** 📋 next to it
   - This is your Railway Postgres connection string

### ✅ STEP 3: Update OjeaV5 with Correct DATABASE_URL

1. **Go back to OjeaV5 Variables**:
   - https://railway.com/project/ad61359f-e003-47db-9feb-2434b9c266f5/service/6c38cd3e-0d5c-4b14-b92c-2f13670bbd21/variables

2. **Update or Add DATABASE_URL**:
   - If `DATABASE_URL` exists: Click **Edit** ✏️
   - If it doesn't exist: Click **"+ New Variable"**
   - Variable Name: `DATABASE_URL`
   - Variable Value: **Paste the value from Step 2**

3. **Save Changes**:
   - Railway will automatically redeploy

### ✅ STEP 4: Check Deployment Logs

1. **Navigate to Deployments**:
   - Go to: https://railway.com/project/ad61359f-e003-47db-9feb-2434b9c266f5/service/6c38cd3e-0d5c-4b14-b92c-2f13670bbd21/deployments

2. **Click on the Latest Deployment** (top of the list)

3. **Look for Success Messages**:

   ```bash
   ✅ Server running on http://0.0.0.0:8080
   ✅ Database Connected Successfully
   ✅ Migrations Complete
   ✅ OJEA IS FULLY ARMED AND OPERATIONAL!
   ```

4. **Check for Error Messages**:
   ```bash
   ❌ password authentication failed
   ❌ CANNOT CONNECT TO DATABASE
   ❌ connection refused
   ```

### ✅ STEP 5: Test the Live Application

1. **Health Check Endpoint**:
   - Visit: https://ojeav5-production.up.railway.app/api/health
   - Expected response:

   ```json
   {
     "status": "ok",
     "stage": "ready",
     "uptime": 123.456
   }
   ```

2. **Frontend Application**:
   - Visit: https://ojea-mexico.netlify.app/feed
   - Videos should load without "Erreur de chargement"

---

## 🛠️ Common Issues & Fixes

### Issue 1: DATABASE_URL Points to Supabase

**Problem**: DATABASE_URL contains `supabase.co`

**Fix**:

1. Get Railway Postgres URL from Database service
2. Replace the entire DATABASE_URL in OjeaV5 service
3. Wait for auto-redeploy

### Issue 2: DATABASE_URL is Missing

**Problem**: No DATABASE_URL variable in OjeaV5 service

**Fix**:

1. Copy DATABASE_URL from Database service (Step 2)
2. Add it to OjeaV5 service variables (Step 3)
3. Service will auto-redeploy

### Issue 3: Password Authentication Failed

**Problem**: Logs show "password authentication failed"

**Possible Causes**:

- Using old/wrong password
- Using Supabase credentials instead of Railway
- DATABASE_URL format is incorrect

**Fix**:

1. Delete existing DATABASE_URL from OjeaV5
2. Copy fresh DATABASE_URL from Database service
3. Paste it into OjeaV5 service
4. Ensure no extra spaces or line breaks

### Issue 4: Connection Refused

**Problem**: Logs show "connection refused" or "ECONNREFUSED"

**Possible Causes**:

- Database service is not running
- Network issue between services

**Fix**:

1. Check Database service status (should be green/active)
2. Restart Database service if needed
3. Restart OjeaV5 service after Database is up

---

## 📊 Reading Railway Logs

### What to Look For:

#### ✅ Successful Startup:

```bash
🛠️  [Startup] Beginning background initialization...
📦 [Startup] Connecting to Database...
✅ [Startup] Database Connected Successfully
📦 [Startup] Running Schema Migrations...
✅ [Startup] Migrations Complete
🚀 OJEA IS FULLY ARMED AND OPERATIONAL! (Traffic Allowed)
```

#### ❌ Database Connection Failure:

```bash
🔥 [Startup] CANNOT CONNECT TO DATABASE: Error: password authentication failed
🔥 [Startup] Database connection failed - ECONNREFUSED
🔥 [Startup] DATABASE_URL format: postgresql://postgres:***...
```

#### ⚠️ Degraded Mode (Missing DATABASE_URL):

```bash
🔥 [Startup] DATABASE_URL is not set. Starting in degraded mode
⚠️ [Startup] Skipping migrations (database not connected)
```

---

## 🚀 Quick Fix Script

If you have Railway CLI installed, run:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
cd OjeaV5
railway link ad61359f-e003-47db-9feb-2434b9c266f5

# View variables
railway variables

# View logs
railway logs

# Restart service
railway restart
```

---

## 📞 Need Help?

Run the diagnostic script:

```powershell
cd OjeaV5
./scripts/railway-diagnostic.ps1
```

This will check:

- ✅ Railway CLI installation
- ✅ Local configuration files
- ✅ Environment variables (if CLI is installed)
- ✅ Recent deployment logs (if CLI is installed)
- 🔗 Direct links to all Railway dashboard pages

---

## 🎯 Expected Result

After following this guide, you should see:

1. **In Railway Logs**:
   - ✅ Database Connected Successfully
   - ✅ No authentication errors
   - ✅ Service status: Active

2. **In Browser**:
   - ✅ Health check returns `{"status": "ok"}`
   - ✅ Frontend loads at ojea-mexico.netlify.app
   - ✅ Videos display in feed

3. **No Errors**:
   - ❌ No "password authentication failed"
   - ❌ No "ECONNREFUSED"
   - ❌ No "Erreur de chargement" on frontend

---

**Your 180-day journey is almost complete! Let's get this database connected! 🚀🇨🇦**
