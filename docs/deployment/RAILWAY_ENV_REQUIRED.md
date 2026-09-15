# 🚂 Railway Backend Environment Variables

**Critical:** These variables MUST be set in Railway Dashboard → Variables tab for the backend to work.

## 🔴 REQUIRED Variables (Backend will crash without these)

| Variable                                                | Description                       | Where to find it                                                    |
| ------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`                                          | PostgreSQL connection string      | Supabase → Settings → Database → Connection Pooling (use port 6543) |
| `VITE_SUPABASE_URL` or `SUPABASE_URL`                   | Your Supabase project URL         | Supabase → Settings → API → Project URL                             |
| `VITE_SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY` | Supabase key for JWT verification | Supabase → Settings → API → anon key OR service_role key            |

## 🟡 Recommended Variables (Features will fail without these)

| Variable                | Description                                | Status         |
| ----------------------- | ------------------------------------------ | -------------- |
| `PEXELS_API_KEY`        | Pexels API key for video/photo collections | ✅ Already set |
| `FAL_API_KEY`           | Fal.ai API key for AI video generation     | Recommended    |
| `DEEPSEEK_API_KEY`      | DeepSeek API key for Güey chat           | Recommended    |
| `STRIPE_SECRET_KEY`     | Stripe secret key for payments             | Recommended    |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret                      | Recommended    |

## 🔧 How to Set Variables in Railway

1. Go to [Railway Dashboard](https://railway.app)
2. Select your backend service
3. Click **Variables** tab
4. Click **+ New Variable**
5. Add each variable (name and value)
6. Click **Save**
7. **IMPORTANT:** Click **Redeploy** button to apply changes

## ❗ Common 500 Error Causes

If you're seeing `500 Internal Server Error` on all endpoints, check:

1. **`DATABASE_URL` missing or invalid**
   - Error: Backend can't connect to database
   - Fix: Set `DATABASE_URL` in Railway Variables

2. **`SUPABASE_URL` or `SUPABASE_KEY` missing**
   - Error: JWT verification fails
   - Fix: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`)

3. **Variables set but not applied**
   - Error: Changes not taking effect
   - Fix: Click **Redeploy** button in Railway after setting variables

## 🔍 How to Check Railway Logs

1. Go to Railway Dashboard → Your Service
2. Click **Deployments** tab
3. Click on the latest deployment
4. View **Logs** tab
5. Look for error messages like:
   - `❌ Unexpected database pool error`
   - `⚠️ Supabase environment variables missing`
   - `Connection timeout`

## 📝 Notes

- Railway supports both `VITE_SUPABASE_URL` and `SUPABASE_URL` (backend code checks both)
- Backend code prioritizes `VITE_SUPABASE_ANON_KEY` over `SUPABASE_SERVICE_ROLE_KEY`
- Always redeploy after changing environment variables
- Database connection uses port 6543 (Connection Pooling) for better performance
