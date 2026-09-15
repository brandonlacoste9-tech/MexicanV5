#!/usr/bin/env tsx
/**
 * Enable Neural Link (Socket.IO) in Ojea frontend
 *
 * This script updates colony-link.ts to enable the WebSocket connection
 * after Render backend is deployed and ready.
 *
 * Usage:
 *   tsx scripts/enable-neural-link.ts [--render-url=https://ojea-api.onrender.com]
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const COLONY_LINK_PATH = join(process.cwd(), "frontend/src/lib/colony-link.ts");
const RENDER_URL =
  process.argv.find((arg) => arg.startsWith("--render-url="))?.split("=")[1] ||
  "https://ojea-api.onrender.com";

function enableNeuralLink() {
  console.log("🔌 Enabling Neural Link (Socket.IO)...\n");

  let content = readFileSync(COLONY_LINK_PATH, "utf-8");

  // 1. Enable connection (remove disabled comment)
  const disabledPattern =
    /\/\/ this\.connect\(\); \/\/ Disabled to prevent Backend Protocol Mismatch Crash/;
  if (disabledPattern.test(content)) {
    content = content.replace(
      disabledPattern,
      "this.connect(); // ✅ Enabled - Render backend ready",
    );
    console.log("✅ Enabled Socket.IO connection");
  } else {
    console.log("⚠️  Connection already enabled or pattern not found");
  }

  // 2. Remove warning about backend incompatibility
  const warningPattern =
    /console\.warn\(\s*"🌱 Ojea: Colony Socket Disabled \(Backend Incompatibility: Missing Socket\.IO\)",\s*\);/;
  if (warningPattern.test(content)) {
    content = content.replace(warningPattern, "");
    console.log("✅ Removed backend incompatibility warning");
  }

  // 3. Update production URL to Render
  const railwayUrlPattern = /https:\/\/ojeav5-production\.up\.railway\.app/;
  if (railwayUrlPattern.test(content)) {
    content = content.replace(railwayUrlPattern, RENDER_URL);
    console.log(`✅ Updated production URL to ${RENDER_URL}`);
  } else if (!content.includes(RENDER_URL)) {
    // If Railway URL not found, ensure Render URL is set
    const prodUrlPattern = /import\.meta\.env\.PROD\s*\?\s*"[^"]+"/;
    if (prodUrlPattern.test(content)) {
      content = content.replace(
        prodUrlPattern,
        `import.meta.env.PROD ? "${RENDER_URL}"`,
      );
      console.log(`✅ Set production URL to ${RENDER_URL}`);
    }
  }

  // 4. Write updated file
  writeFileSync(COLONY_LINK_PATH, content, "utf-8");

  console.log("\n✅ Neural Link enabled!");
  console.log("\n📋 Next steps:");
  console.log("   1. Verify Render backend is live and healthy");
  console.log("   2. Set VITE_COLONY_API_URL in Vercel env vars");
  console.log("   3. Deploy frontend to Vercel");
  console.log("   4. Test connection in browser console");
}

try {
  enableNeuralLink();
} catch (error) {
  console.error("❌ Error enabling Neural Link:", error);
  process.exit(1);
}
