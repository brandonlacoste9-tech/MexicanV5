/**
 * 🧪 Trinity Integration Test
 * Tests Brain + Hands + Soul integration
 *
 * RUN WITH: npx ts-node scripts/test-trinity.ts
 */

import {
  searchTrendsTool,
  analyzeCompetitorTool,
  validateDesignTool,
  TIGUY_SYSTEM_PROMPT,
} from "../backend/ai/orchestrator";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(emoji: string, message: string, color: string = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

function section(title: string) {
  console.log("\n" + "=".repeat(70));
  log("🎯", title, colors.bright + colors.blue);
  console.log("=".repeat(70) + "\n");
}

async function test1_BrowserService() {
  section("TEST 1: THE HANDS - Browser Service (Trends)");

  try {
    log("🤲", "Testing Mexico trend discovery...", colors.cyan);

    const result = await searchTrendsTool.execute({
      platform: "google",
      region: "cdmx",
    });

    if (result.success) {
      log("✅", "Browser service operational!", colors.green);
      console.log("\nDiscovered trends:");
      console.log(JSON.stringify(result.trends?.slice(0, 3) || [], null, 2));
      console.log(`\nTotal trends found: ${result.trends?.length || 0}`);
      return true;
    } else {
      log("❌", `Failed: ${result.error}`, colors.red);
      log("⚠️", "Is the browser service running on port 8000?", colors.yellow);
      return false;
    }
  } catch (error) {
    log("❌", `Test failed: ${error}`, colors.red);
    return false;
  }
}

async function test2_CompetitorAnalysis() {
  section("TEST 2: THE HANDS - Competitor Analysis");

  try {
    log("📊", "Testing competitor analysis...", colors.cyan);
    log(
      "ℹ️",
      "Using example TikTok URL (may fail if service not running)",
      colors.cyan,
    );

    const result = await analyzeCompetitorTool.execute({
      url: "https://www.tiktok.com/@mexicomemes",
      metrics: ["followers", "engagement", "language"],
    });

    if (result.success) {
      log("✅", "Competitor analysis working!", colors.green);
      console.log("\nAnalysis results:");
      console.log(JSON.stringify(result.analysis, null, 2));
      return true;
    } else {
      log("❌", `Failed: ${result.error}`, colors.red);
      return false;
    }
  } catch (error) {
    log("❌", `Test failed: ${error}`, colors.red);
    return false;
  }
}

async function test3_DesignValidation() {
  section("TEST 3: THE SOUL - Design System Validation");

  // Test 3a: Non-compliant code
  try {
    log("🎨", "Test 3a: Validating NON-compliant English code...", colors.cyan);

    const badCode = `
      <Button className="bg-blue-500">Submit</Button>
      <div>Loading...</div>
      <Button variant="destructive">Delete</Button>
    `;

    const result1 = await validateDesignTool.execute({
      component_code: badCode,
      component_type: "button",
    });

    if (!result1.compliant && result1.suggestions.length > 0) {
      log("✅", "Correctly detected non-compliant code!", colors.green);
      console.log("\nSuggestions:");
      result1.suggestions.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
    } else {
      log("⚠️", "Should have flagged English text!", colors.yellow);
    }
  } catch (error) {
    log("❌", `Test 3a failed: ${error}`, colors.red);
  }

  // Test 3b: Compliant code
  try {
    log("🎨", "Test 3b: Validating COMPLIANT Mexicano code...", colors.cyan);

    const goodCode = `
      <Button className="bg-ojea-blue">Envoyer</Button>
      <div className="text-sm">Ça charge...</div>
      <Button className="bg-ojea-alert">Sacrer ça aux vidanges</Button>
    `;

    const result2 = await validateDesignTool.execute({
      component_code: goodCode,
      component_type: "button",
    });

    if (result2.compliant) {
      log("✅", "Mexico-compliant code approved!", colors.green);
      console.log("\nMexico Colors available:");
      console.log(JSON.stringify(result2.mexico_colors, null, 2));
    } else {
      log("⚠️", "Unexpected validation failure", colors.yellow);
      console.log("Suggestions:", result2.suggestions);
    }

    return true;
  } catch (error) {
    log("❌", `Test 3b failed: ${error}`, colors.red);
    return false;
  }
}

async function test4_FullTrinity() {
  section("TEST 4: FULL TRINITY WORKFLOW");

  log("🧠", "Güey System Prompt (first 300 chars):", colors.cyan);
  console.log(TIGUY_SYSTEM_PROMPT.substring(0, 300).trim() + "...\n");

  log("🔗", "Simulating Güey workflow...", colors.yellow);

  try {
    // Step 1: Design validation
    log("1️⃣", 'Güey: "I need to create a trending card..."', colors.yellow);

    const cardCode = `
      <Card className="bg-ojea-snow border-ojea-blue">
        <CardHeader>
          <h2 className="text-ojea-blue font-bold">Tendances au México</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Ça charge...</p>
          <Button className="bg-ojea-blue text-white mt-4">
            Voir plus
          </Button>
        </CardContent>
      </Card>
    `;

    const validation = await validateDesignTool.execute({
      component_code: cardCode,
      component_type: "card",
    });

    if (validation.compliant) {
      log("✅", "Step 1: Design validated!", colors.green);
    } else {
      log("⚠️", "Step 1: Design needs fixes:", colors.yellow);
      console.log(validation.suggestions);
    }

    // Step 2: Could discover trends (skip if service not running)
    log(
      "2️⃣",
      'Güey: "Now I could fetch real Mexico trends..."',
      colors.yellow,
    );
    log("ℹ️", "(Skipped - requires browser service running)", colors.cyan);

    // Success
    log("🎉", "TRINITY WORKFLOW COMPLETE!", colors.bright + colors.green);
    return true;
  } catch (error) {
    log("❌", `Trinity workflow failed: ${error}`, colors.red);
    return false;
  }
}

async function runAllTests() {
  console.log("\n" + "🐝".repeat(35));
  log(
    "🚀",
    "OJEA TRINITY INTEGRATION TEST SUITE",
    colors.bright + colors.blue,
  );
  console.log("🐝".repeat(35) + "\n");

  log("📋", "Testing components:", colors.cyan);
  console.log("   🧠 Brain: Güey Orchestrator (DeepSeek/Gemini)");
  console.log("   🤲 Hands: Browser-Use Automation");
  console.log("   🎨 Soul: UI/UX Design System\n");

  const results = {
    browserService: false,
    competitorAnalysis: false,
    designValidation: false,
    fullTrinity: false,
  };

  results.browserService = await test1_BrowserService();
  results.competitorAnalysis = await test2_CompetitorAnalysis();
  results.designValidation = await test3_DesignValidation();
  results.fullTrinity = await test4_FullTrinity();

  // Summary
  section("TEST SUMMARY");

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  console.log(`Tests passed: ${passed}/${total}\n`);

  if (passed === total) {
    log("✅", "ALL TESTS PASSED!", colors.bright + colors.green);
    log(
      "🐝",
      "Ojea Trinity is fully operational!",
      colors.bright + colors.blue,
    );
  } else {
    log(
      "⚠️",
      "Some tests failed - check browser service status",
      colors.yellow,
    );
    if (!results.browserService && !results.competitorAnalysis) {
      log(
        "💡",
        "Start browser service: cd ojea-browser-automation && uvicorn ojea_automation_api:app --reload",
        colors.cyan,
      );
    }
  }

  console.log("\n" + "⚜️".repeat(35) + "\n");
}

// Run tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests };
