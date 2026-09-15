# OjeaV5 Project Priorities 🎯

**Goal:** Get the project working and deployed

---

## 🔴 Critical (Blocking)

### 1. Railway Backend Deployment

**Status:** ❌ Healthcheck failing  
**Issue:** Backend not starting (likely missing `DATABASE_URL`)

**Fix:**

1. Railway Dashboard → OjeaV5 service → Variables
2. Add `DATABASE_URL` (from Supabase or Railway Postgres)
3. Redeploy
4. Verify healthcheck passes

**Files:**

- `RAILWAY_DEPLOYMENT_CHECKLIST.md` - Step-by-step guide
- `RAILWAY_CRITICAL_FIX.md` - Troubleshooting

---

## 🟡 Important (Next Steps)

### 2. Max API Testing

**Status:** ✅ Routes created, ⏳ Needs backend live

**Once Railway is fixed:**

- Test Max API endpoints
- Verify WhatsApp integration ready
- Test commands: `status`, `verify:gcs`, `scan the hive`

**Files:**

- `docs/WAKE_UP_MAX.md` - Max API guide
- `scripts/wake-max.ts` - Test script

---

### 3. Frontend → Backend Connection

**Status:** ⏳ Depends on Railway

**Once backend is live:**

- Verify frontend can reach backend
- Test API endpoints
- Check Neural Link (Socket.IO) connection

---

## 🟢 Nice-to-Have (Not Blocking)

### 4. Supabase MCP

**Status:** ⚠️ OAuth required, but scripts work fine

**Current:** Database access via scripts works  
**Future:** Can set up MCP later if needed

**Files:**

- `docs/SUPABASE_MCP_OAUTH_SETUP.md` - OAuth guide
- `scripts/test-supabase-mcp.ts` - Test script

---

## 📋 Immediate Action Plan

### Step 1: Fix Railway (NOW)

1. Check Railway logs for exact error
2. Set `DATABASE_URL` in Railway Variables
3. Redeploy backend
4. Verify healthcheck passes

### Step 2: Test Backend (After Railway)

1. Test `/api/health` endpoint
2. Test Max API endpoints
3. Verify database connection

### Step 3: Test Frontend (After Backend)

1. Verify frontend → backend connection
2. Test API calls
3. Check Socket.IO connection

---

## 🚀 Quick Start

**Right now, focus on:**

1. **Railway Dashboard** → Check logs → Set `DATABASE_URL` → Redeploy
2. **Test backend** → `npm run check:railway`
3. **Test Max** → `npm run wake:max`

---

**Let's get Railway fixed first, then everything else will follow!** 🎯
