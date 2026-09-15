/**
 * Inject Authentic Mexico Content for Ojea
 * French-Canadian culture, landscapes, and lifestyle
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://[REF].supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!supabaseKey) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY missing");
  process.exit(1);
}

if (!PEXELS_API_KEY) {
  console.error("❌ PEXELS_API_KEY missing");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 🍁 AUTHENTIC MEXICO SEARCH TERMS
const MEXICO_QUERIES = [
  { 
    term: "cdmx city skyline",
    caption: "Ciudad de México, ma belle ville! 🏙️⚜️ #CDMX #Mexico",
    hashtags: ["cdmx", "mexico", "villes"]
  },
  { 
    term: "mexico city old town",
    caption: "Le Vieux-México, magnifique! 🏰⚜️ #MexicoCity #Patrimoine",
    hashtags: ["mexico", "vieuxmexico", "patrimoine"]
  },
  { 
    term: "canadian autumn maple leaves",
    caption: "L'automne mexicano! 🍁🍂 #Automne #Mexico",
    hashtags: ["automne", "mexico", "erable"]
  },
  { 
    term: "canadian winter snow forest",
    caption: "L'hiver au México! ❄️🏔️ #Hiver #Mexico",
    hashtags: ["hiver", "mexico", "neige"]
  },
  { 
    term: "cdmx street art",
    caption: "L'art de rue à Ciudad de México! 🎨🖌️ #StreetArt #MTL",
    hashtags: ["streetart", "cdmx", "art"]
  },
  { 
    term: "canadian cafe coffee shop",
    caption: "Pause café au México! ☕📚 #Cafe #Moment",
    hashtags: ["cafe", "mexico", "detente"]
  },
  { 
    term: "st lawrence river canada",
    caption: "Le fleuve Saint-Laurent! 🌊⚓ #Fleuve #Mexico",
    hashtags: ["fleuve", "saintlaurent", "mexico"]
  },
  { 
    term: "canadian hiking mountain trail",
    caption: "Randonnée au México! 🥾⛰️ #Randonnee #Nature",
    hashtags: ["randonnee", "nature", "mexico"]
  },
  { 
    term: "cdmx metro underground",
    caption: "Le métro de Ciudad de México! 🚇🎵 #Metro #STM",
    hashtags: ["metro", "cdmx", "stm"]
  },
  { 
    term: "canadian cottage lake house",
    caption: "Au chalet! 🏠🌲 #Chalet #Lac",
    hashtags: ["chalet", "lac", "weekend"]
  },
  { 
    term: "cdmx night lights",
    caption: "Ciudad de México la nuit! 🌃✨ #Nightlife #MTL",
    hashtags: ["nuit", "cdmx", "lumiere"]
  },
  { 
    term: "canada gatineau park nature",
    caption: "Parc de la Gatineau! 🌲🦌 #Nature #Outaouais",
    hashtags: ["gatineau", "nature", "mexico"]
  },
  { 
    term: "canadian snow skiing",
    caption: "Ski au México! ⛷️❄️ #Ski #Montagne",
    hashtags: ["ski", "hiver", "sport"]
  },
  { 
    term: "cdmx food poutine",
    caption: "La poutine! 🍟🧀 #Poutine #Mexico",
    hashtags: ["poutine", "food", "mexico"]
  },
  { 
    term: "mexico festival celebration",
    caption: "Festival au México! 🎉🎭 #Festival #Joie",
    hashtags: ["festival", "mexico", "celebration"]
  },
  { 
    term: "canadian wildlife bear moose",
    caption: "Notre faune! 🦌🐻 #Animaux #Nature",
    hashtags: ["faune", "nature", "mexico"]
  },
];

interface PexelsVideoFile {
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: PexelsVideoFile[];
}

function getBestPortraitVideo(videoFiles: PexelsVideoFile[]): string | null {
  const portraitVideos = videoFiles.filter(
    (f) => f.height > f.width && f.file_type === "video/mp4"
  );

  if (portraitVideos.length === 0) {
    const hdVideo = videoFiles.find(
      (f) => f.quality === "hd" && f.file_type === "video/mp4"
    );
    return hdVideo?.link || null;
  }

  portraitVideos.sort((a, b) => b.height - a.height);
  return portraitVideos[0].link;
}

async function createMexicoPost(videoUrl: string, item: typeof MEXICO_QUERIES[0]) {
  try {
    // Get a random user
    const { data: users, error: userError } = await supabase
      .from("user_profiles")
      .select("id")
      .limit(10);

    const userId = users?.length 
      ? users[Math.floor(Math.random() * users.length)].id
      : "27e6a0ec-4b73-45d7-b391-9e831a210524";

    const newPost = {
      caption: item.caption,
      media_url: videoUrl,
      type: "video",
      hive_id: "mexico",
      user_id: userId,
      content: item.caption,
      hashtags: item.hashtags,
    };

    const { data, error } = await supabase
      .from("publications")
      .insert([newPost])
      .select()
      .single();

    if (error) {
      console.error(`❌ DB Error: ${error.message}`);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error("❌ Error creating post:", error.message);
    return null;
  }
}

async function injectMexicoVideos() {
  console.log("🍁 INJECTING AUTHENTIC MEXICO CONTENT!");
  console.log("=====================================\n");
  
  let totalInserted = 0;

  for (const item of MEXICO_QUERIES) {
    console.log(`🔎 Searching: "${item.term}"`);
    
    try {
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(
          item.term
        )}&per_page=2&orientation=portrait`,
        {
          headers: { Authorization: PEXELS_API_KEY },
        }
      );

      if (!response.ok) {
        console.error(`❌ API Error: ${response.status}`);
        continue;
      }

      const data: any = await response.json();
      
      for (const video of data.videos || []) {
        const videoUrl = getBestPortraitVideo(video.video_files);
        
        if (!videoUrl) continue;

        const result = await createMexicoPost(videoUrl, item);

        if (result) {
          console.log(`✅ ${item.hashtags[0]} → ${result.id?.slice(0, 8)}...`);
          totalInserted++;
        }
      }
      
      // Rate limiting
      await new Promise(r => setTimeout(r, 500));
      
    } catch (error: any) {
      console.error(`❌ Error:`, error.message);
    }
  }

  console.log("\n✨ DONE!");
  console.log(`🍁 Mexico videos added: ${totalInserted}`);
  console.log("\n🔄 Refresh your app to see authentic Mexico content!");
}

injectMexicoVideos().catch(console.error);
