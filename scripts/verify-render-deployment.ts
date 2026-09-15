#!/usr/bin/env tsx
/**
 * Verify Render Backend Deployment
 *
 * Checks that Render backend is live and Neural Link is ready
 *
 * Usage:
 *   tsx scripts/verify-render-deployment.ts [--url=https://ojea-api.onrender.com]
 */

import "dotenv/config";

const RENDER_URL =
  process.argv.find((arg) => arg.startsWith("--url="))?.split("=")[1] ||
  process.env.VITE_COLONY_API_URL ||
  "https://ojea-api.onrender.com";

async function checkHealth() {
  try {
    const response = await fetch(`${RENDER_URL}/health`);
    const data = await response.json();

    if (response.ok && data.status === "ok") {
      console.log("✅ Health check passed");
      console.log(`   Database: ${data.database || "unknown"}`);
      return true;
    } else {
      console.log("❌ Health check failed");
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (error: any) {
    console.log("❌ Health check error:", error.message);
    return false;
  }
}

async function checkSocketIO() {
  try {
    const response = await fetch(`${RENDER_URL}/socket.io/`, {
      method: "GET",
    });

    // Socket.IO endpoint should return 200 or 400 (not 404)
    if (response.status === 200 || response.status === 400) {
      console.log("✅ Socket.IO endpoint accessible");
      return true;
    } else {
      console.log(`❌ Socket.IO endpoint returned ${response.status}`);
      return false;
    }
  } catch (error: any) {
    console.log("❌ Socket.IO check error:", error.message);
    return false;
  }
}

async function checkDialogflowWebhook() {
  try {
    const response = await fetch(`${RENDER_URL}/api/dialogflow/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        detectIntentResponse: {
          queryResult: {
            intent: { displayName: "greeting" },
            parameters: {},
          },
        },
      }),
    });

    const data = await response.json();

    if (response.ok && data.fulfillmentResponse) {
      console.log("✅ Dialogflow webhook working");
      console.log(
        `   Response: ${data.fulfillmentResponse.messages?.[0]?.text?.text?.[0] || "OK"}`,
      );
      return true;
    } else {
      console.log("⚠️  Dialogflow webhook returned unexpected response");
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error: any) {
    console.log("❌ Dialogflow webhook error:", error.message);
    return false;
  }
}

async function main() {
  console.log("🔍 Verifying Render Backend Deployment...\n");
  console.log(`URL: ${RENDER_URL}\n`);

  const results = {
    health: false,
    socketIO: false,
    dialogflow: false,
  };

  // Check health
  console.log("1️⃣  Checking health endpoint...");
  results.health = await checkHealth();
  console.log();

  // Check Socket.IO
  console.log("2️⃣  Checking Socket.IO endpoint...");
  results.socketIO = await checkSocketIO();
  console.log();

  // Check Dialogflow webhook
  console.log("3️⃣  Checking Dialogflow webhook...");
  results.dialogflow = await checkDialogflowWebhook();
  console.log();

  // Summary
  console.log("📊 Summary:");
  console.log(`   Health: ${results.health ? "✅" : "❌"}`);
  console.log(`   Socket.IO: ${results.socketIO ? "✅" : "❌"}`);
  console.log(`   Dialogflow: ${results.dialogflow ? "✅" : "❌"}`);
  console.log();

  if (results.health && results.socketIO) {
    console.log("✅ Render backend is ready for Neural Link!");
    console.log("\n📋 Next steps:");
    console.log(
      "   1. Run: tsx scripts/enable-neural-link.ts --render-url=" + RENDER_URL,
    );
    console.log("   2. Set VITE_COLONY_API_URL in Vercel env vars");
    console.log("   3. Deploy frontend");
    console.log("   4. Test connection in browser console");
    process.exit(0);
  } else {
    console.log("❌ Some checks failed. Review errors above.");
    console.log("\n💡 Troubleshooting:");
    console.log("   - Check Render service logs");
    console.log("   - Verify environment variables are set");
    console.log("   - Ensure service is not sleeping (free tier)");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Verification failed:", error);
  process.exit(1);
});
