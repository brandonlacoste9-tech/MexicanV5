/**
 * Bulk-fill Mexico feed toward FEED_REPLENISH_TARGET.
 *   npm run seed:bulk
 *   npm run seed:bulk -- --target=300
 */
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import { replenishMexicoFeedPool } from "../backend/services/feed-seed-providers.js";

function parseArg(name: string, fallback: number): number {
  const arg = process.argv.find((x) => x.startsWith(`--${name}=`));
  const n = arg ? Number(arg.split("=")[1]) : fallback;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

async function main() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) {
    console.error("VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY required (MexicoV5, not Zyeuté)");
    process.exit(1);
  }
  if (/zyeute/i.test(url)) {
    console.error("Refusing Zyeuté Supabase URL. Use MexicoV5.");
    process.exit(1);
  }

  const target = parseArg("target", 500);
  const maxApify = parseArg("apify", 100);

  console.log(`Target pool size: ${target} (Apify batch up to ${maxApify})`);

  const result = await replenishMexicoFeedPool({
    supabaseUrl: url,
    supabaseServiceKey: key,
    force: true,
    targetCount: target,
    maxApify,
    maxPexels: 25,
  });

  console.log("Done:");
  console.log(`   Pool: ${result.feedCountBefore} → ${result.feedCountAfter}`);
  console.log(`   Apify: ${result.apify}  Pexels: ${result.pexels}`);
  if (result.errors.length) console.log(`   Errors: ${result.errors.join("; ")}`);
}

main().catch((e) => {
  console.error("Fatal:", e instanceof Error ? e.message : e);
  process.exit(1);
});
