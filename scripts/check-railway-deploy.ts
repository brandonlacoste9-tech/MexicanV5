#!/usr/bin/env tsx
/**
 * Check Railway Deployment Status
 * Tests Railway backend health endpoints and reports status
 */

import "dotenv/config";

const RAILWAY_URL =
  process.env.RAILWAY_URL ||
  process.env.VITE_RAILWAY_URL ||
  "https://ojea-api.railway.app";

async function checkHealth() {
  console.log("🔍 Checking Railway Deployment Status...\n");
  console.log(`📍 Railway URL: ${RAILWAY_URL}\n`);

  const endpoints = [
    { path: "/api/health", name: "Health Check" },
    { path: "/ready", name: "Readiness Probe" },
    { path: "/api/health/feed", name: "Feed Health" },
  ];

  let allHealthy = true;

  for (const endpoint of endpoints) {
    try {
      const url = `${RAILWAY_URL}${endpoint.path}`;
      console.log(`Testing: ${endpoint.name} (${endpoint.path})`);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log(`  ✅ ${endpoint.name}: OK`);
        if (Object.keys(data).length > 0) {
          console.log(`     Response: ${JSON.stringify(data).slice(0, 100)}`);
        }
      } else {
        console.log(
          `  ❌ ${endpoint.name}: ${response.status} ${response.statusText}`,
        );
        allHealthy = false;
      }
    } catch (error: any) {
      console.log(
        `  ❌ ${endpoint.name}: ${error.message || "Connection failed"}`,
      );
      allHealthy = false;
    }
    console.log();
  }

  console.log("─".repeat(60));
  if (allHealthy) {
    console.log("✅ All health checks passed!");
    console.log("\n🎉 Railway deployment is healthy!");
  } else {
    console.log("❌ Some health checks failed");
    console.log("\n📋 Next Steps:");
    console.log("1. Check Railway Deploy Logs (not Build Logs)");
    console.log("2. Look for '🔥 [Startup] EXITING:' messages");
    console.log("3. Verify DATABASE_URL is set in Railway Variables");
    console.log("4. Check if backend is starting on correct PORT");
    console.log("\nSee: docs/RAILWAY_DEPLOY_LOGS_GUIDE.md");
  }
}

checkHealth().catch((error) => {
  console.error("❌ Error checking Railway:", error);
  process.exit(1);
});
