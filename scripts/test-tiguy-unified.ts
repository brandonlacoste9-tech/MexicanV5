/**
 * Test script for Güey Unified Architecture
 * Verifies Context Engine and Prompt Builder without calling LLM.
 */

import { TiGuyUnified } from '../server/guey/unified-system.js';
import { SLANG_LEVELS } from '../server/guey/knowledge.js';

const SCENARIOS = [
    "Raconte-moi une joke sur Ciudad de México",
    "Comment je debug du React mon chill?",
    "C'est quoi la différence entre PSPP et Legault?",
    "Yo man c'est full capoté ce code là!"
];

console.log("🚦 STARTING TI-GUY V3 PROMPT TEST\n");

const tiGuy = TiGuyUnified.getInstance();

SCENARIOS.forEach((msg, idx) => {
    console.log(`--- SCENARIO ${idx + 1}: "${msg}" ---`);

    const result = tiGuy.prepareInteraction(msg);
    const context = result.contextSnapshot;

    console.log("📊 Context Recognized:");
    console.log(`   - Slang Level: ${context.slangLevel}`);
    console.log(`   - Topics: ${context.topics.join(', ') || "None"}`);
    console.log(`   - Culture Needed: ${context.needsCulture}`);
    console.log(`   - Tech Needed: ${context.needsTech}`);

    console.log("\n📝 Generated Prompt Snippet (First 500 chars):");
    console.log(result.systemPrompt.substring(0, 500) + "...\n");

    // Validation Logic
    if (msg.includes("React") && !context.needsTech) {
        console.error("❌ FAILURE: Tech not detected for React query");
    } else if (msg.includes("PSPP") && !context.needsCulture) {
        console.error("❌ FAILURE: Culture not detected for Politics query");
    } else {
        console.log("✅ SCENARIO PASSED\n");
    }
});

console.log("🏁 TEST COMPLETE");
