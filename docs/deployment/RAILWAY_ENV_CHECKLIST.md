# 🔍 Railway Environment Variables Checklist

## ✅ REQUIRED Variables (Backend will crash without these)

| Variable                                        | Status       | How to Check            | Where to Get It                                                 |
| ----------------------------------------------- | ------------ | ----------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`                                  | ⚠️ **CHECK** | Railway → Variables tab | Supabase → Settings → Database → Connection Pooling (port 6543) |
| `VITE_SUPABASE_URL` or `SUPABASE_URL`           | ⚠️ **CHECK** | Railway → Variables tab | Supabase → Settings → API → Project URL                         |
| `VITE_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY` | ⚠️ **CHECK** | Railway → Variables tab | Supabase → Settings → API → anon key                            |
| `SUPABASE_SERVICE_ROLE_KEY`                     | ⚠️ **CHECK** | Railway → Variables tab | Supabase → Settings → API → service_role key (JWT verification) |

## 🟡 RECOMMENDED Variables (Features will fail without these)

| Variable                | Status         | Purpose                              |
| ----------------------- | -------------- | ------------------------------------ |
| `PEXELS_API_KEY`        | ✅ Already set | Pexels video/photo API               |
| `FAL_API_KEY`           | ⚠️ Optional    | AI video generation                  |
| `DEEPSEEK_API_KEY`      | ⚠️ Optional    | Güey chat                          |
| `STRIPE_SECRET_KEY`     | ⚠️ Optional    | Payment processing                   |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ Optional    | Stripe webhooks                      |
| `REDIS_URL`             | ⚠️ Optional    | Caching (warnings are OK if not set) |

---

## 🔧 How to Check Railway Variables

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app/project/ad61359f-e003-47db-9feb-2434b9c266f5
   - Click your backend service
   - Click **Variables** tab

2. **Verify Each Variable:**
   - Check that all REQUIRED variables are present
   - Ensure values match your Supabase dashboard
   - No typos or extra spaces

3. **Common Issues:**
   - ❌ Variable name typo (e.g., `SUPABASE_URL` vs `SUPABASE_URl`)
   - ❌ Missing `VITE_` prefix (backend accepts both)
   - ❌ Wrong value (check Supabase dashboard)
   - ❌ Variable set but not applied (need to redeploy)

---

## 🚨 Critical: JWT Verification Failure

If you're seeing: `JWT Verification failed: Invalid API key`

**This means:**

- `SUPABASE_SERVICE_ROLE_KEY` is missing OR incorrect
- OR `VITE_SUPABASE_ANON_KEY` is missing (backend falls back to anon key)

**Fix:**

1. Go to Supabase Dashboard → Settings → API
2. Copy the `service_role` key (⚠️ Keep this secret!)
3. Add to Railway: `SUPABASE_SERVICE_ROLE_KEY` = `<your-service-role-key>`
4. Redeploy Railway

---

## ⚠️ Redis Warnings (Non-Critical)

If you see: `[WARN] [ModerationCache] Redis Error:`

**This is OK!** The app will work without Redis. Redis is only used for:

- Moderation caching (performance optimization)
- Rate limiting caching (falls back to in-memory)

**To fix (optional):**

- Add `REDIS_URL` to Railway Variables
- Or ignore the warnings (app works fine without it)

---

## 📋 Quick Verification Script

After setting variables, test with:

```bash
# Test health endpoint (should work without auth)
curl https://ojeav5-production.up.railway.app/api/health

# Should return:
# {"status":"healthy","message":"Ojea Live"}
```

If health check works but `/api/users/...` fails with 500:

- Check DATABASE_URL is correct
- Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
- Check Railway logs for specific error message

---

## 🔍 Finding the Missing Column (If Database Error Persists)

1. **Railway Dashboard → Your Service → Deployments → Latest → Logs**
2. **Search for:** `errorMissingColumn` or `column "X" does not exist`
3. **Look for lines like:**
   ```
   column "cash_credits" does not exist
   ```
4. **See `DATABASE_SCHEMA_CHECK.md` for how to add the column**

---

## ✅ Verification Checklist

Before your Google meeting, verify:

- [ ] All REQUIRED variables are set in Railway
- [ ] `DATABASE_URL` format is correct (port 6543, not 5432)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set (fixes JWT errors)
- [ ] Railway backend health check returns 200 OK
- [ ] No critical errors in Railway logs (Redis warnings are OK)
- [ ] System clock is synced (fixes auth timing issues)

---

**Last Updated:** 2026-01-12
