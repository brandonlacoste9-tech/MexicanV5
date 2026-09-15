# Railway Deployment Checklist ✅

**Goal:** Get back to "Deployment successful" state after fixing environment variables

---

## Pre-Deployment Checklist

- [ ] **Check Railway Logs** - Identify exact startup error
- [ ] **Verify DATABASE_URL** - Use Railway Postgres (`ojea-db`) or Supabase
- [ ] **Verify VITE_SUPABASE_URL** - Set in Railway Variables
- [ ] **Verify VITE_SUPABASE_ANON_KEY** - Set in Railway Variables
- [ ] **Verify MAX_API_TOKEN** - Set if using Max API (optional)

---

## Deployment Steps

### 1. Set Environment Variables

**Railway Dashboard → Variables Tab:**

| Variable                 | Value Source                                                                        | Required        |
| ------------------------ | ----------------------------------------------------------------------------------- | --------------- |
| `DATABASE_URL`           | Railway Postgres (`ojea-db` → Variables → `DATABASE_URL`) OR Supabase (port 6543) | ✅ **CRITICAL** |
| `VITE_SUPABASE_URL`      | Supabase Dashboard → Settings → API → Project URL                                   | ✅ **CRITICAL** |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon key                                      | ✅ **CRITICAL** |
| `MAX_API_TOKEN`          | `p8KXOOrrGHmOsJF5aKprjaytb8df156q`                                                  | ⚠️ Optional     |

### 2. Redeploy

**Railway Dashboard:**

- Click **Deployments** tab
- Click **Redeploy** button
- Wait 3-5 minutes for deployment

**Or via CLI:**

```bash
railway up
```

---

## Post-Deployment Verification

### ✅ Step 1: Check Deployment Status

**Railway Dashboard → Latest Deployment:**

- [ ] Build: ✅ Successful
- [ ] Deploy: ✅ Successful
- [ ] **Network → Healthcheck:** ✅ **"Deployment successful"** (not "Healthcheck failure")

### ✅ Step 2: Test Health Endpoint

**Open in browser:**

```
https://ojeav5-production.up.railway.app/api/health
```

**Expected:**

- Status: `200 OK`
- Response: `{"status":"ok","uptime":...}`

**Also test:**

```
https://ojeav5-production.up.railway.app/ready
```

### ✅ Step 3: Check Logs

**Railway Dashboard → Logs Tab**

**Look for:**

- ✅ `✅ [Startup] Database Connected Successfully`
- ✅ `✅ Server running on http://0.0.0.0:${PORT}`
- ✅ `Health check available at http://0.0.0.0:${PORT}/api/health`

**If you see errors:**

- `🔥 [Startup] EXITING: Missing DATABASE_URL` → Set `DATABASE_URL`
- `🔥 [Startup] EXITING: Database connection failed` → Check `DATABASE_URL` format
- `🔥 [Startup] EXITING: Migration failed` → Check migration logs

### ✅ Step 4: Test via Script

```bash
npm run check:railway
```

**Expected:** All endpoints return `200 OK`

---

## Troubleshooting

### Healthcheck Still Failing?

1. **Check Logs** - Look for `🔥 [Startup] EXITING:` messages
2. **Verify DATABASE_URL** - Test connection string format
3. **Check Port** - Backend should listen on `0.0.0.0`, not `localhost`
4. **Increase Timeout** - Update `healthcheckTimeout` in `railway.json` if needed

### Database Connection Issues?

**If using Railway Postgres:**

- Verify `ojea-db` service is running
- Use `DATABASE_URL` from `ojea-db` → Variables tab
- Format: `postgresql://postgres:[PASSWORD]@ojea-db-production.up.railway.app:5432/railway`

**If using Supabase:**

- Use Connection Pooling (port 6543)
- Verify Supabase is accessible from Railway's region
- Format: `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true`

---

## Success Criteria

✅ **Deployment successful** in Railway Dashboard  
✅ **Healthcheck passes** (Network → Healthcheck shows success)  
✅ **`/api/health` returns 200** in browser  
✅ **Logs show server started** successfully  
✅ **No `🔥 [Startup] EXITING:` errors** in logs

---

**Once all checks pass, your deployment is successful!** 🎉
