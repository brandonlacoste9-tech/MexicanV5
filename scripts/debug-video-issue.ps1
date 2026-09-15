#!/usr/bin/env pwsh
# Debug Video Loading Issue - Ojea Railway Deployment

Write-Host "🔍 DEBUGGING VIDEO LOADING ISSUE" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

$RAILWAY_URL = "https://ojeav5-production.up.railway.app"
$FRONTEND_URL = "https://ojea-mexico.netlify.app"

# Test 1: Health Check
Write-Host "1️⃣  Testing Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$RAILWAY_URL/api/health" -Method Get -ErrorAction Stop
    Write-Host "   ✅ Backend is UP" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor White
    if ($health.stage) {
        Write-Host "   Stage: $($health.stage)" -ForegroundColor White
    }
} catch {
    Write-Host "   ❌ Backend Health Check Failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Database Connection (via debug endpoint)
Write-Host "2️⃣  Testing Database Connection..." -ForegroundColor Yellow
try {
    $debug = Invoke-RestMethod -Uri "$RAILWAY_URL/api/debug" -Method Get -ErrorAction Stop
    Write-Host "   ✅ Debug endpoint responded" -ForegroundColor Green
    Write-Host "   Response: $($debug | ConvertTo-Json -Depth 2)" -ForegroundColor White
} catch {
    Write-Host "   ⚠️  Debug endpoint unavailable (might be disabled)" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Test 3: Feed API
Write-Host "3️⃣  Testing Feed API (videos endpoint)..." -ForegroundColor Yellow
try {
    $feed = Invoke-RestMethod -Uri "$RAILWAY_URL/api/posts/feed?limit=5" -Method Get -ErrorAction Stop
    if ($feed -and $feed.Count -gt 0) {
        Write-Host "   ✅ Feed API returned $($feed.Count) posts" -ForegroundColor Green
        Write-Host "   First post ID: $($feed[0].id)" -ForegroundColor White
        Write-Host "   First post has media: $($feed[0].media_url -ne $null -or $feed[0].mux_playback_id -ne $null)" -ForegroundColor White
    } elseif ($feed -and $feed.posts) {
        Write-Host "   ✅ Feed API returned $($feed.posts.Count) posts" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Feed API returned empty array" -ForegroundColor Yellow
        Write-Host "   This means database is working but has NO VIDEOS!" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Feed API Failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Check Railway Logs (if CLI installed)
Write-Host "4️⃣  Checking Railway Logs..." -ForegroundColor Yellow
$railwayCLI = Get-Command railway -ErrorAction SilentlyContinue
if ($railwayCLI) {
    Write-Host "   Fetching last 20 lines..." -ForegroundColor Gray
    railway logs --lines 20 2>&1 | Select-Object -Last 20
} else {
    Write-Host "   ⚠️  Railway CLI not installed" -ForegroundColor Yellow
    Write-Host "   Install: npm install -g @railway/cli" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "🎯 DIAGNOSTICS SUMMARY" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 What to check next:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   A) If health check FAILED:" -ForegroundColor White
Write-Host "      → Railway service is down or not deployed" -ForegroundColor Gray
Write-Host "      → Check: https://railway.com/project/ad61359f-e003-47db-9feb-2434b9c266f5" -ForegroundColor Blue
Write-Host ""
Write-Host "   B) If health check OK but feed API FAILED:" -ForegroundColor White
Write-Host "      → Database connection issue" -ForegroundColor Gray
Write-Host "      → Check DATABASE_URL in Railway variables" -ForegroundColor Gray
Write-Host "      → Look for 'password authentication failed' in logs" -ForegroundColor Gray
Write-Host ""
Write-Host "   C) If feed API returns EMPTY array:" -ForegroundColor White
Write-Host "      → Database is working but has NO VIDEO DATA" -ForegroundColor Gray
Write-Host "      → Need to seed database with videos" -ForegroundColor Gray
Write-Host "      → Or fix video upload/processing" -ForegroundColor Gray
Write-Host ""
Write-Host "   D) If feed API returns videos but frontend shows nothing:" -ForegroundColor White
Write-Host "      → Frontend-backend communication issue" -ForegroundColor Gray
Write-Host "      → CORS error? Check browser console" -ForegroundColor Gray
Write-Host "      → Frontend calling wrong API URL?" -ForegroundColor Gray
Write-Host ""

Write-Host "🔗 Quick Links:" -ForegroundColor Cyan
Write-Host "   • Railway Dashboard: https://railway.com/project/ad61359f-e003-47db-9feb-2434b9c266f5" -ForegroundColor Blue
Write-Host "   • Backend Health: $RAILWAY_URL/api/health" -ForegroundColor Blue
Write-Host "   • Frontend: $FRONTEND_URL/feed" -ForegroundColor Blue
Write-Host ""
