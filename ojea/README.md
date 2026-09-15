# Ojea web (TikTok-style)

Playable Mexico feed wired to **MexicoV5**. This is the live Ojea UI:
For You / Following / Friends / LIVE, right-hand action rail, comments
as a side panel, share sheet, search tabs, Explore chips.

Not a rewrite of `frontend/` (that stays the ZyeuteV5 stack + Mexico pack).

## Stack
- TanStack Start + Router
- Vite + Tailwind v4
- Supabase MexicoV5 (anon key via env; RLS on the server)

## Run
```bash
cd ojea
cp ../../.env.example .env   # or set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

Clip **posters** are in `public/clips/`. Videos (`*.mp4`) stay out of git
(repo ignores them). Drop the mp4s next to the jpgs to play motion.

## What this snapshot includes
- Desktop left nav (Para ti, Explorar, Siguiendo, Amigos, En vivo, Subir, Buzón, Perfil)
- Comments dock + share sheet (copy, WhatsApp, DM, repost, not interested, report)
- Search (`/buscar`) with Destacados / Videos / Usuarios / Sonidos / Etiquetas
- Explore category + trending chips
- es-MX / en

Do **not** commit Render keys, service_role, or DB passwords.
