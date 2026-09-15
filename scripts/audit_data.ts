import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load env vars from root .env
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// FALLBACK: Prefer Anon Key if Service Key fails, or just use Anon Key as it is known to work from previous server fix.
const supabaseKey =
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(`🔑 Using Key (last 4 chars): ...${supabaseKey?.slice(-4)}`);

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runAudit() {
  const report = [];
  report.push("🔍 Starting Ojea Data Audit...");
  let flawsFound = 0;

  try {
    // 1. Check Users Integrity
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*");
    if (usersError) {
      report.push("❌ Error fetching users: " + usersError.message);
    } else {
      report.push(`\n👤 Analyzing ${users?.length || 0} Users...`);
      /* @ts-ignore */
      users?.forEach((user) => {
        const missingFields = [];
        if (!user.username) missingFields.push("username");
        if (!user.hive_id) missingFields.push("hive_id (No Region Assigned)");
        if (!user.avatar_url) missingFields.push("avatar_url");

        if (missingFields.length > 0) {
          report.push(
            `   ⚠️  User Flaw [${user.id.substring(0, 8)}...]: Missing ${missingFields.join(", ")}`,
          );
          flawsFound++;
        }
      });
    }

    // 2. Check Posts Integrity
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*");
    if (postsError) {
      report.push("ℹ️  Could not fetch posts: " + postsError.message);
    } else {
      report.push(`\n📝 Analyzing ${posts?.length || 0} Posts...`);
      /* @ts-ignore */
      posts?.forEach((post) => {
        const issues = [];
        if (!post.user_id) issues.push("Orphaned (No Author)");
        if (!post.content && !post.image_url) issues.push("Empty Content");
        if (!post.hives || post.hives.length === 0)
          issues.push("No Hives Tagged");

        if (issues.length > 0) {
          report.push(
            `   ⚠️  Post Flaw [${post.id.substring(0, 8)}...]: ${issues.join(", ")}`,
          );
          flawsFound++;
        }
      });
    }
  } catch (err) {
    report.push("❌ Critical Audit Error: " + err);
  }

  report.push("\n-----------------------------------");
  if (flawsFound === 0) {
    report.push("✅ No obvious data flaws found. Database looks clean.");
  } else {
    report.push(
      `❌ Found ${flawsFound} data flaws that need enrichment/repair.`,
    );
  }

  // Print to console
  console.log(report.join("\n"));
}

runAudit();
