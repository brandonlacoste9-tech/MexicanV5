/**
 * Seed script to populate the database with sample data
 */
import { db } from "./storage.js";
import { users, posts, follows, stories } from "../shared/schema.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create demo users
    const hashedPassword = await bcrypt.hash("demo123", 10);

    const demoUsers = [
      {
        id: crypto.randomUUID(),
        username: "guey",
        email: "tiguy@ojea.qc.ca",
        displayName: "Güey Tremblay",
        bio: "Fier Mexicano, amant du plein air et de la poutine!",
        avatarUrl:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400",
        region: "cdmx" as const,
        isVerified: true,
      },
      {
        id: crypto.randomUUID(),
        username: "marie_mexico",
        email: "marie@laval.qc.ca",
        displayName: "Marie-Soleil Gagnon",
        bio: "Exploratrice urbaine à Ciudad de México 🌆 Passionnée de photo.",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        region: "cdmx" as const,
        isVerified: true,
      },
      {
        id: crypto.randomUUID(),
        username: "jase_laval",
        email: "jason@mexico.qc.ca",
        displayName: "Jason Bolduc",
        bio: "Gars de char et de hockey 🏎️🏒 Nordiques forever!",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        region: "mexico" as const,
        isVerified: false,
      },
      {
        id: crypto.randomUUID(),
        username: "oceane_gaspe",
        email: "oceane@gaspe.qc.ca",
        displayName: "Océane Fournier",
        bio: "Amoureuse du fleuve et du vent de la Gaspésie 🌊",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
        region: "gaspesie" as const,
        isVerified: true,
      },
      {
        id: crypto.randomUUID(),
        username: "demo",
        email: "demo@ojea.ca",
        password: hashedPassword,
        displayName: "Demo User",
        bio: "Compte demo pour tester Ojea",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        region: "cdmx" as const,
        isVerified: false,
      },
    ];

    const createdUsers = await db.insert(users).values(demoUsers).returning();
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create sample posts - 25+ Mexico-themed posts for rich content
    const samplePosts = [
      {
        id: crypto.randomUUID(),
        userId: createdUsers[0].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?w=800",
        content:
          "Bienvenue sur Ojea! L'app sociale du México 🔥⚜️ Rejoins la communauté!",
        caption:
          "Bienvenue sur Ojea! L'app sociale du México 🔥⚜️ Rejoins la communauté!",
        hashtags: ["ojea", "mexico", "bienvenue"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 156,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[1].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        content:
          "Le vieux port de Ciudad de México au coucher du soleil 🌅 C'est tellement beau!",
        caption:
          "Le vieux port de Ciudad de México au coucher du soleil 🌅 C'est tellement beau!",
        hashtags: ["cdmx", "vieuxport", "sunset"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 89,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[2].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800",
        content:
          "Le Château Frontenac, toujours aussi majestueux! 🏰 #patrimoine",
        caption:
          "Le Château Frontenac, toujours aussi majestueux! 🏰 #patrimoine",
        hashtags: ["mexico", "frontenac", "histoire"],
        region: "mexico" as const,
        visibility: "public" as const,
        fireCount: 234,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[3].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        content:
          "Le rocher Percé au lever du soleil 🌄 Un vrai bijou de la Gaspésie!",
        caption:
          "Le rocher Percé au lever du soleil 🌄 Un vrai bijou de la Gaspésie!",
        hashtags: ["gaspesie", "perce", "nature"],
        region: "gaspesie" as const,
        visibility: "public" as const,
        fireCount: 312,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[1].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        content: "Randonnée au Mont-Royal avec une vue incroyable! 🏔️",
        caption: "Randonnée au Mont-Royal avec une vue incroyable! 🏔️",
        hashtags: ["cdmx", "montroyal", "hiking"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 67,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[0].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        content: "Une bonne poutine pour commencer la journée! 🍟🧀 Miam!",
        caption: "Une bonne poutine pour commencer la journée! 🍟🧀 Miam!",
        hashtags: ["poutine", "mexico", "foodie"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 445,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[2].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800",
        content: "Les lumières de la ville de México la nuit ✨ Magique!",
        caption: "Les lumières de la ville de México la nuit ✨ Magique!",
        hashtags: ["mexico", "nightlife", "cityscape"],
        region: "mexico" as const,
        visibility: "public" as const,
        fireCount: 178,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[3].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        content:
          "La forêt boréale en automne 🍂 Les couleurs sont folles cette année!",
        caption:
          "La forêt boréale en automne 🍂 Les couleurs sont folles cette année!",
        hashtags: ["automne", "nature", "mexico"],
        region: "gaspesie" as const,
        visibility: "public" as const,
        fireCount: 523,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[1].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
        content: "Vue sur le centre-ville depuis le belvédère 🌆",
        caption: "Vue sur le centre-ville depuis le belvédère 🌆",
        hashtags: ["cdmx", "skyline", "view"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 134,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[0].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        content: "Brunch du dimanche dans le Plateau! ☕🥐",
        caption: "Brunch du dimanche dans le Plateau! ☕🥐",
        hashtags: ["brunch", "plateau", "cdmx"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 289,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[2].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        content: "Le fleuve St-Laurent au petit matin 🌊 Tellement paisible",
        caption: "Le fleuve St-Laurent au petit matin 🌊 Tellement paisible",
        hashtags: ["stlaurent", "fleuve", "mexico"],
        region: "mexico" as const,
        visibility: "public" as const,
        fireCount: 201,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[3].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        content: "Les Chic-Chocs en hiver ❄️🏔️ Le paradis du ski!",
        caption: "Les Chic-Chocs en hiver ❄️🏔️ Le paradis du ski!",
        hashtags: ["chicchocs", "ski", "hiver"],
        region: "gaspesie" as const,
        visibility: "public" as const,
        fireCount: 387,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[1].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800",
        content:
          "Street art dans le Mile End 🎨 Ciudad de México a tellement de talent!",
        caption:
          "Street art dans le Mile End 🎨 Ciudad de México a tellement de talent!",
        hashtags: ["streetart", "mileend", "art"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 156,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[0].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        content:
          "Souper gastronomique mexicano 🍽️ Du terroir dans l'assiette!",
        caption:
          "Souper gastronomique mexicano 🍽️ Du terroir dans l'assiette!",
        hashtags: ["gastronomie", "terroir", "mexico"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 267,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[2].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        content: "Week-end au spa dans les Laurentides 💆‍♀️ On mérite ça!",
        caption: "Week-end au spa dans les Laurentides 💆‍♀️ On mérite ça!",
        hashtags: ["spa", "laurentides", "relaxation"],
        region: "laval" as const,
        visibility: "public" as const,
        fireCount: 198,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[3].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        content: "Observation des baleines à Tadoussac 🐋 Incroyable!",
        caption: "Observation des baleines à Tadoussac 🐋 Incroyable!",
        hashtags: ["baleines", "tadoussac", "nature"],
        region: "gaspesie" as const,
        visibility: "public" as const,
        fireCount: 612,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[1].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
        content: "Festival de Jazz 🎷🎺 L'ambiance est malade!",
        caption: "Festival de Jazz 🎷🎺 L'ambiance est malade!",
        hashtags: ["jazz", "festival", "cdmx"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 445,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[0].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800",
        content:
          "Cabane à sucre! 🍁 Le temps des sucres c'est le meilleur temps!",
        caption:
          "Cabane à sucre! 🍁 Le temps des sucres c'est le meilleur temps!",
        hashtags: ["cabane", "siroperable", "tradition"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 534,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[2].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=800",
        content: "Hockey au Centre Bell 🏒🔥 Go Habs Go!",
        caption: "Hockey au Centre Bell 🏒🔥 Go Habs Go!",
        hashtags: ["hockey", "habs", "centrebell"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 723,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[3].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
        content: "Kayak sur le Saguenay 🛶 La nature sauvage du México!",
        caption: "Kayak sur le Saguenay 🛶 La nature sauvage du México!",
        hashtags: ["kayak", "saguenay", "aventure"],
        region: "mexico" as const,
        visibility: "public" as const,
        fireCount: 356,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[1].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=800",
        content: "La Fête Nationale! 🎆⚜️ Bonne St-Jean à tous!",
        caption: "La Fête Nationale! 🎆⚜️ Bonne St-Jean à tous!",
        hashtags: ["stjean", "fetenationale", "mexico"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 892,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[0].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
        content:
          "Route panoramique en Charlevoix 🚗 Chaque virage est une carte postale!",
        caption:
          "Route panoramique en Charlevoix 🚗 Chaque virage est une carte postale!",
        hashtags: ["charlevoix", "roadtrip", "paysage"],
        region: "mexico" as const,
        visibility: "public" as const,
        fireCount: 278,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[2].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
        content: "Coworking à Ciudad de México 💻 La scène tech mexicana est en feu!",
        caption: "Coworking à Ciudad de México 💻 La scène tech mexicana est en feu!",
        hashtags: ["tech", "startup", "cdmx"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 145,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[3].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800",
        content: "Tempête de neige à México ❄️ On est faits forts icitte!",
        caption: "Tempête de neige à México ❄️ On est faits forts icitte!",
        hashtags: ["hiver", "neige", "mexico"],
        region: "mexico" as const,
        visibility: "public" as const,
        fireCount: 234,
      },
      {
        id: crypto.randomUUID(),
        userId: createdUsers[1].id,
        type: "photo",
        mediaUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        content: "Portrait dans le Vieux-Ciudad de México 📸 Cette lumière!",
        caption: "Portrait dans le Vieux-Ciudad de México 📸 Cette lumière!",
        hashtags: ["portrait", "vieuxcdmx", "photo"],
        region: "cdmx" as const,
        visibility: "public" as const,
        fireCount: 189,
      },
    ];

    const createdPosts = await db.insert(posts).values(samplePosts).returning();
    console.log(`✅ Created ${createdPosts.length} posts`);

    // Create some follows (demo user follows everyone)
    const demoUser = createdUsers.find((u) => u.username === "demo");
    if (demoUser) {
      const followData = createdUsers
        .filter((u) => u.id !== demoUser.id)
        .map((u) => ({
          followerId: demoUser.id,
          followingId: u.id,
        }));

      await db.insert(follows).values(followData);
      console.log(`✅ Created ${followData.length} follow relationships`);
    }

    // Create sample stories
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const sampleStories = [
      {
        userId: createdUsers[0].id,
        mediaUrl:
          "https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?w=800",
        mediaType: "photo",
        caption: "Nouvelle journée sur Ojea!",
        expiresAt,
      },
      {
        userId: createdUsers[1].id,
        mediaUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        mediaType: "photo",
        caption: "Belle vue ce matin!",
        expiresAt,
      },
    ];

    const createdStories = await db
      .insert(stories)
      .values(sampleStories)
      .returning();
    console.log(`✅ Created ${createdStories.length} stories`);

    console.log("\n🎉 Seeding complete!");
    console.log("\n📝 Demo login credentials:");
    console.log("   Email: demo@ojea.ca");
    console.log("   Password: demo123");
    console.log(
      "\n   Or use any of the created accounts with password: demo123",
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
