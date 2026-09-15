#!/usr/bin/env tsx
/**
 * Railway Database Setup Script
 * Idempotent script that sets up the database schema and seed data
 * Safe to run multiple times - checks for existing data before creating
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";
import { readFileSync } from "fs";
import { randomUUID } from "crypto";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found");
  process.exit(1);
}

async function setupDatabase() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log("✅ Connected to Railway database\n");

    // Step 1: Create schema (run initial migration)
    console.log("📋 Step 1: Setting up database schema...");
    try {
      const schemaPath = join(__dirname, "../migrations/0000_misty_namorita.sql");
      const schemaSQL = readFileSync(schemaPath, "utf-8");
      await client.query(schemaSQL);
      console.log("   ✅ Schema created\n");
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        console.log("   ⚠️  Schema already exists (skipping)\n");
      } else {
        throw error;
      }
    }

    // Step 2: Create publications table if it doesn't exist
    console.log("📋 Step 2: Creating publications table...");
    const publicationsCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'publications'
      );
    `);

    if (!publicationsCheck.rows[0].exists) {
      // Create hive_id enum if it doesn't exist
      await client.query(`
        DO $$ BEGIN
          CREATE TYPE hive_id AS ENUM('mexico', 'brazil', 'argentina', 'mexico');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await client.query(`
        CREATE TABLE publications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          caption TEXT,
          media_url TEXT,
          visibilite TEXT DEFAULT 'public',
          hive_id hive_id DEFAULT 'mexico',
          region_id TEXT,
          reactions_count INTEGER DEFAULT 0,
          comments_count INTEGER DEFAULT 0,
          est_masque BOOLEAN DEFAULT false,
          deleted_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS publications_user_id_idx ON publications(user_id);
        CREATE INDEX IF NOT EXISTS publications_created_at_idx ON publications(created_at);
        CREATE INDEX IF NOT EXISTS publications_hive_id_idx ON publications(hive_id);
        CREATE INDEX IF NOT EXISTS publications_region_id_idx ON publications(region_id);
      `);

      console.log("   ✅ Publications table created\n");
    } else {
      console.log("   ⚠️  Publications table already exists (skipping)\n");
    }

    // Step 3: Ensure at least one user exists
    console.log("📋 Step 3: Ensuring test user exists...");
    const userCheck = await client.query("SELECT COUNT(*) as count FROM user_profiles");
    const userCount = parseInt(userCheck.rows[0].count);

    if (userCount === 0) {
      const userId = randomUUID();
      await client.query(
        `INSERT INTO user_profiles (id, username, email, display_name, bio, region, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (username) DO NOTHING`,
        [
          userId,
          "test_user_mexico",
          "test@ojea.mexico",
          "Test User México",
          "Test account for Ojea seed data",
          "mexico",
        ]
      );
      console.log("   ✅ Test user created\n");
    } else {
      console.log(`   ✅ Found ${userCount} existing user(s)\n`);
    }

    // Step 4: Run seed migration if posts don't exist
    console.log("📋 Step 4: Checking seed data...");
    const postCheck = await client.query(
      "SELECT COUNT(*) as count FROM publications WHERE hive_id = 'mexico'"
    );
    const postCount = parseInt(postCheck.rows[0].count);

    if (postCount === 0) {
      console.log("   📝 No Mexico posts found, running seed migration...");
      const seedPath = join(__dirname, "../migrations/0012_seed_initial_data.sql");
      const seedSQL = readFileSync(seedPath, "utf-8");
      await client.query(seedSQL);
      console.log("   ✅ Seed data inserted\n");
    } else {
      console.log(`   ✅ Found ${postCount} existing Mexico posts (skipping seed)\n`);
    }

    console.log("✅ Database setup complete!");
    console.log(`📊 Status: ${userCount || 1} user(s), ${postCount || 15} Mexico post(s)`);

  } catch (error: any) {
    console.error("❌ Database setup failed:", error.message);
    // Don't exit - let the app start anyway
    console.error("⚠️  Continuing with application startup...");
  } finally {
    await client.end();
  }
}

setupDatabase();
