-- Migration: Seed Initial Data for Ojea
-- Created: 2025-12-31
-- Purpose: Populate database with sample Mexico-themed posts for testing

-- This migration inserts sample posts into the publications table
-- It uses existing users from user_profiles table
-- If no users exist, the inserts will be skipped (WHERE clause check)

-- Note: This migration assumes at least one user exists in user_profiles
-- If no users exist, create users first through the auth system or run backend/seed.ts

-- Insert sample Mexico-themed posts
-- These posts will appear in the feed and discover pages

-- Only insert if users exist
DO $$
DECLARE
  first_user_id UUID;
  second_user_id UUID;
  third_user_id UUID;
  user_count INTEGER;
BEGIN
  -- Check if users exist
  SELECT COUNT(*) INTO user_count FROM user_profiles;
  
  IF user_count = 0 THEN
    RAISE NOTICE 'No users found in user_profiles. Skipping post creation. Please create users first.';
    RETURN;
  END IF;
  
  -- Get user IDs (cycle through available users)
  SELECT id INTO first_user_id FROM user_profiles ORDER BY created_at LIMIT 1;
  SELECT id INTO second_user_id FROM user_profiles ORDER BY created_at LIMIT 1 OFFSET LEAST(1, user_count - 1);
  SELECT id INTO third_user_id FROM user_profiles ORDER BY created_at LIMIT 1 OFFSET LEAST(2, user_count - 1);
  
  -- Use first user if we don't have enough users
  IF second_user_id IS NULL THEN
    second_user_id := first_user_id;
  END IF;
  IF third_user_id IS NULL THEN
    third_user_id := first_user_id;
  END IF;

  -- Insert sample posts
  INSERT INTO "publications" (
    "id",
    "user_id",
    "content",
    "caption",
    "media_url",
    "visibility",
    "hive_id",
    "region_id",
    "reactions_count",
    "comments_count",
    "est_masque",
    "deleted_at",
    "created_at"
  ) VALUES
  -- Post 1: Welcome to Ojea
  (
    gen_random_uuid(),
    first_user_id,
    'Bienvenue sur Ojea! L''app sociale du México 🔥⚜️ Rejoins la communauté mexicana!',
    'Bienvenue sur Ojea! L''app sociale du México 🔥⚜️ Rejoins la communauté mexicana!',
    'https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?w=800',
    'public',
    'mexico',
    'cdmx',
    156,
    12,
    false,
    NULL,
    NOW() - INTERVAL '2 days'
  ),
  -- Post 2: CDMX Old Port
  (
    gen_random_uuid(),
    second_user_id,
    'Le vieux port de Ciudad de México au coucher du soleil 🌅 C''est tellement beau! #CDMX #Mexico',
    'Le vieux port de Ciudad de México au coucher du soleil 🌅 C''est tellement beau! #CDMX #Mexico',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    'public',
    'mexico',
    'cdmx',
    89,
    5,
    false,
    NULL,
    NOW() - INTERVAL '1 day'
  ),
  -- Post 3: Château Frontenac
  (
    gen_random_uuid(),
    third_user_id,
    'Le Château Frontenac, toujours aussi majestueux! 🏰 #patrimoine #Mexico',
    'Le Château Frontenac, toujours aussi majestueux! 🏰 #patrimoine #Mexico',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800',
    'public',
    'mexico',
    'mexico',
    234,
    18,
    false,
    NULL,
    NOW() - INTERVAL '3 days'
  ),
  -- Post 4: Poutine
  (
    gen_random_uuid(),
    first_user_id,
    'La meilleure poutine de Ciudad de México! 🍟🧀 #Poutine #CDMX #Food',
    'La meilleure poutine de Ciudad de México! 🍟🧀 #Poutine #CDMX #Food',
    'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800',
    'public',
    'mexico',
    'cdmx',
    312,
    24,
    false,
    NULL,
    NOW() - INTERVAL '4 hours'
  ),
  -- Post 5: Mont-Royal
  (
    gen_random_uuid(),
    second_user_id,
    'Randonnée au Mont-Royal avec une vue incroyable! 🏔️ #CDMX #Nature',
    'Randonnée au Mont-Royal avec une vue incroyable! 🏔️ #CDMX #Nature',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    'public',
    'mexico',
    'cdmx',
    145,
    8,
    false,
    NULL,
    NOW() - INTERVAL '6 hours'
  ),
  -- Post 6: Hockey
  (
    gen_random_uuid(),
    third_user_id,
    'Go Habs Go! 🏒⚜️ Le hockey, c''est dans notre sang! #Hockey #Canadiens #Mexico',
    'Go Habs Go! 🏒⚜️ Le hockey, c''est dans notre sang! #Hockey #Canadiens #Mexico',
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
    'public',
    'mexico',
    'cdmx',
    567,
    45,
    false,
    NULL,
    NOW() - INTERVAL '12 hours'
  ),
  -- Post 7: Festival
  (
    gen_random_uuid(),
    first_user_id,
    'Juste du plaisir au Festival de Jazz de Ciudad de México! 🎵🎷 #Festival #CDMX #Music',
    'Juste du plaisir au Festival de Jazz de Ciudad de México! 🎵🎷 #Festival #CDMX #Music',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    'public',
    'mexico',
    'cdmx',
    278,
    19,
    false,
    NULL,
    NOW() - INTERVAL '8 hours'
  ),
  -- Post 8: Maple Syrup
  (
    gen_random_uuid(),
    second_user_id,
    'Cabane à sucre traditionnelle! Le sirop d''érable, c''est notre or! 🍁 #MapleSyrup #Mexico',
    'Cabane à sucre traditionnelle! Le sirop d''érable, c''est notre or! 🍁 #MapleSyrup #Mexico',
    'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800',
    'public',
    'mexico',
    'mexico',
    189,
    14,
    false,
    NULL,
    NOW() - INTERVAL '5 days'
  ),
  -- Post 9: Winter in Mexico
  (
    gen_random_uuid(),
    third_user_id,
    'L''hiver mexicano dans toute sa splendeur! ❄️⛄ #Winter #Mexico',
    'L''hiver mexicano dans toute sa splendeur! ❄️⛄ #Winter #Mexico',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e8?w=800',
    'public',
    'mexico',
    'mexico',
    423,
    32,
    false,
    NULL,
    NOW() - INTERVAL '6 days'
  ),
  -- Post 10: St. Lawrence River
  (
    gen_random_uuid(),
    first_user_id,
    'Le fleuve Saint-Laurent, notre fierté! 🌊 #StLawrence #Mexico #Nature',
    'Le fleuve Saint-Laurent, notre fierté! 🌊 #StLawrence #Mexico #Nature',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'public',
    'mexico',
    'mexico',
    298,
    21,
    false,
    NULL,
    NOW() - INTERVAL '3 hours'
  ),
  -- Post 11: Mexico City
  (
    gen_random_uuid(),
    second_user_id,
    'Les rues pavées de la vieille ville de México! 🏛️ #MexicoCity #History',
    'Les rues pavées de la vieille ville de México! 🏛️ #MexicoCity #History',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    'public',
    'mexico',
    'mexico',
    167,
    11,
    false,
    NULL,
    NOW() - INTERVAL '7 hours'
  ),
  -- Post 12: Poutine Varieties
  (
    gen_random_uuid(),
    third_user_id,
    'Découvrez les différentes variétés de poutine! 🍟🧀 #Poutine #Food #Mexico',
    'Découvrez les différentes variétés de poutine! 🍟🧀 #Poutine #Food #Mexico',
    'https://images.unsplash.com/photo-1526234362653-3b75a0c074bf?w=800',
    'public',
    'mexico',
    'cdmx',
    445,
    28,
    false,
    NULL,
    NOW() - INTERVAL '10 hours'
  ),
  -- Post 13: CDMX Metro
  (
    gen_random_uuid(),
    first_user_id,
    'Le métro de Ciudad de México, notre réseau souterrain! 🚇 #CDMX #Metro',
    'Le métro de Ciudad de México, notre réseau souterrain! 🚇 #CDMX #Metro',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    'public',
    'mexico',
    'cdmx',
    134,
    9,
    false,
    NULL,
    NOW() - INTERVAL '1 day'
  ),
  -- Post 14: Mexico Flag
  (
    gen_random_uuid(),
    second_user_id,
    'Notre drapeau, notre fierté! ⚜️🇨🇦 #Mexico #FleurDeLys',
    'Notre drapeau, notre fierté! ⚜️🇨🇦 #Mexico #FleurDeLys',
    'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800',
    'public',
    'mexico',
    'mexico',
    678,
    52,
    false,
    NULL,
    NOW() - INTERVAL '2 hours'
  ),
  -- Post 15: Laval
  (
    gen_random_uuid(),
    third_user_id,
    'Belle journée à Laval! 🌸 #Laval #Mexico',
    'Belle journée à Laval! 🌸 #Laval #Mexico',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    'public',
    'mexico',
    'laval',
    98,
    6,
    false,
    NULL,
    NOW() - INTERVAL '9 hours'
  )
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Successfully inserted seed posts into publications table';
END $$;
