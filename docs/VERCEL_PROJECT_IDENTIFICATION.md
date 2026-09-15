# Vercel Project Identification 🔍

**Issue:** Two OjeaV5 builds in Vercel  
**Correct Repo:** `brandonlacoste9-tech/OjeaV5`

---

## How to Identify the Correct Project

### Step 1: Check Vercel Dashboard

**Go to:** https://vercel.com/dashboard

**Look for:**

- Project name: `OjeaV5` or `ojea-v5`
- GitHub repo: `brandonlacoste9-tech/OjeaV5`
- Recent deployments matching your commits

### Step 2: Verify GitHub Connection

**In Vercel Dashboard → Project Settings → Git:**

**Correct project should show:**

- **Repository:** `brandonlacoste9-tech/OjeaV5`
- **Production Branch:** `main` (or `master`)
- **Root Directory:** `/` (or `frontend` if monorepo)

### Step 3: Check Recent Deployments

**Look at deployment history:**

- ✅ **Correct project:** Recent deployments match your commits
- ❌ **Wrong project:** Old/deleted repo or different branch

---

## Common Scenarios

### Scenario 1: Duplicate Projects

**Two projects pointing to same repo:**

- One might be old/archived
- One might be from a different branch
- One might be a test project

**Solution:**

- Archive or delete the incorrect one
- Keep the one with active deployments

### Scenario 2: Different Repos

**Two projects with similar names:**

- One: `brandonlacoste9-tech/OjeaV5` ✅ (correct)
- One: Different repo or fork ❌

**Solution:**

- Delete the incorrect project
- Verify correct repo is connected

### Scenario 3: Branch-Based Projects

**Two projects for different branches:**

- One: `main` branch (production)
- One: `develop` or feature branch

**Solution:**

- Keep both if intentional
- Or consolidate to one project with branch previews

---

## How to Verify Correct Project

### Check Project URL

**Correct project should deploy to:**

- Production: `https://ojea-mexico.netlify.app` (or your custom domain)
- Preview: `https://ojea-v5-{branch}.vercel.app`

### Check Build Logs

**Recent deployments should show:**

- ✅ Builds from `brandonlacoste9-tech/OjeaV5`
- ✅ Commits matching your GitHub repo
- ✅ Build commands: `npm run build:vercel` or `vite build`

### Check Environment Variables

**Correct project should have:**

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (pointing to Railway backend)

---

## Quick Identification Checklist

**Correct Vercel Project:**

- [ ] Repository: `brandonlacoste9-tech/OjeaV5`
- [ ] Recent deployments match your commits
- [ ] Environment variables are set correctly
- [ ] Production URL works
- [ ] Build logs show successful builds

**Incorrect Project:**

- [ ] Different repository
- [ ] No recent deployments
- [ ] Missing environment variables
- [ ] Build failures or old errors

---

## Action Plan

1. **Check Vercel Dashboard** - Identify both projects
2. **Compare repositories** - Which one is `brandonlacoste9-tech/OjeaV5`?
3. **Check recent activity** - Which has active deployments?
4. **Archive/Delete** - Remove the incorrect one
5. **Verify** - Confirm correct project is active

---

## If You Need Help Identifying

**Share:**

- Project names in Vercel
- Repository URLs shown in Vercel
- Recent deployment dates
- Which one has working production URL

**I can help you determine which is correct!** 🔍
