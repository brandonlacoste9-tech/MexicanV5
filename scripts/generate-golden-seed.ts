import "dotenv/config";
import axios from "axios";
import fs from "fs";

/**
 * 🍁 GOLDEN SEED GENERATOR
 * Fetches high-quality videos from Pexels and generates a SQL seed file
 * to populate Ojea with epic content instantly.
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const SEED_FILE = "seed-golden-library-massive.sql";

async function generateSeed() {
  if (!PEXELS_API_KEY) {
    console.error("❌ PEXELS_API_KEY missing in .env");
    return;
  }

  console.log("🚀 Fetching epic content from Pexels...");

  try {
    // Search for Mexico-ish themes: 'nature', 'city', 'winter', 'food', 'lifestyle'
    const queries = ["forest", "snow", "city street", "cooking", "happy people"];
    let allVideos: any[] = [];

    for (const q of queries) {
      const response = await axios.get(`https://api.pexels.com/videos/search?query=${q}&per_page=6&orientation=portrait`, {
        headers: { Authorization: PEXELS_API_KEY }
      });
      allVideos = [...allVideos, ...response.data.videos];
    }

    console.log(`✅ Collected ${allVideos.length} epic videos.`);

    const sqlHeader = `-- MASSIVE GOLDEN LIBRARY SEED
-- Generated automatically for Ojea Launch ⚜️
-- This script injects ${allVideos.length} curated videos into the database.

DO $$
DECLARE
    sys_user_id UUID;
BEGIN
    SELECT id INTO sys_user_id FROM user_profiles WHERE username = 'guey' LIMIT 1;
    IF sys_user_id IS NULL THEN
        SELECT id INTO sys_user_id FROM user_profiles LIMIT 1;
    END IF;

    IF sys_user_id IS NOT NULL THEN
        RAISE NOTICE '🌱 Seeding ${allVideos.length} publications...';
        
        -- Insertions
`;

    let sqlBody = "";
    
    allVideos.forEach((v, i) => {
      const hdFile = v.video_files.find((f: any) => f.quality === 'hd') || v.video_files[0];
      const caption = `Moment Ojea #${i+1} 🍁 #Mexico #Vibe`;
      const content = `Découvrez la beauté du monde avec Ojea. Propulsé par la communauté. ⚜️`;
      
      sqlBody += `        INSERT INTO publications (user_id, content, caption, media_url, thumbnail_url, processing_status, hive_id, visibility, reactions_count, created_at)
        VALUES (sys_user_id, '${content}', '${caption}', '${hdFile.link}', '${v.image}', 'completed', 'mexico', 'public', ${Math.floor(Math.random()*500)}, NOW() - INTERVAL '${i} hours');\n\n`;
    });

    const sqlFooter = `        RAISE NOTICE '✅ Massive Golden Library Seeded successfully!';
    ELSE
        RAISE NOTICE '⚠️ No user found for seeding.';
    END IF;
END $$;
`;

    fs.writeFileSync(SEED_FILE, sqlHeader + sqlBody + sqlFooter);
    console.log(`✨ Seed script generated at ${SEED_FILE}`);
    console.log(`👉 Run: psql < ${SEED_FILE}`);

  } catch (error: any) {
    console.error("❌ Generation failed:", error.message);
  }
}

generateSeed();
