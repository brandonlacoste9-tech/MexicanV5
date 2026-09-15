import pg from "pg";

/**
 * Ojea Schema Doctor 🩺
 * Automatically heals the database schema by ensuring required columns exist.
 * This is a 'self-healing' mechanism for data drift.
 */
export async function healSchema(pool: pg.Pool) {
  const client = await pool.connect();
  try {
    console.log("🩺 [Doctor] Starting Schema Health Check...");

    // 1. publications table
    const publicationsColumns = [
      { name: "location", type: "text" },
      { name: "city", type: "text" },
      { name: "reactions_count", type: "integer DEFAULT 0" },
      { name: "comments_count", type: "integer DEFAULT 0" },
      { name: "est_masque", type: "boolean DEFAULT false" },
      { name: "visibility", type: "text DEFAULT 'public'" },
      { name: "hive_id", type: "text DEFAULT 'mexico'" },
      { name: "embedding", type: "text" },
      { name: "mexico_score", type: "integer DEFAULT 0" },
      { name: "shares_count", type: "integer DEFAULT 0" },
      { name: "piasse_count", type: "integer DEFAULT 0" },
      { name: "transcribed_at", type: "timestamp" },
      { name: "ai_generated", type: "boolean DEFAULT false" },
      { name: "viral_score", type: "integer DEFAULT 0" },
    ];

    for (const col of publicationsColumns) {
      await client.query(
        `ALTER TABLE "publications" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type};`,
      );
    }

    // 2. user_profiles table
    const userColumns = [
      { name: "location", type: "text" },
      { name: "city", type: "text" },
      { name: "hive_id", type: "text DEFAULT 'mexico'" },
      { name: "role", type: "text DEFAULT 'citoyen'" },
      { name: "credits", type: "integer DEFAULT 0" },
      { name: "piasse_balance", type: "double precision DEFAULT 0.0" },
    ];

    for (const col of userColumns) {
      await client.query(
        `ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type};`,
      );
    }

    console.log("✅ [Doctor] Schema is Healthy!");
  } catch (err: any) {
    console.warn(
      "⚠️ [Doctor] Schema healing encountered a non-fatal overlap:",
      err.message,
    );
  } finally {
    client.release();
  }
}
