# Best move

Do **not** rewrite OjeaV5. Copy it into MexicanV5, then swap a region pack.

## Order
1. Keep this demo live so UI can be judged.
2. Copy `frontend/` + `backend/` from ZyeuteV5 into this repo (or subtree).
3. Add `config/region.ts` (this folder is the prototype).
4. New Supabase project for Mexico — never share Zyeuté DB/keys.
5. Replace `fr-CA` / Québec / joual / fleur-de-lis with `es-MX` / México / mexican slang.
6. Point seed jobs at Mexico TikTok tags (`cdmx`, `mexico`, `parati`, city names).
7. Deploy frontend (Vercel/Netlify) + API (Render) as **ojea** services.

## First V5 files to localize
- `frontend/src/hooks/useSEO.ts`
- `backend/.env.fly.example` (`DEFAULT_LANGUAGE`, `DEFAULT_TIMEZONE`)
- `backend/services/mexicanizer.ts`
- `scripts/mexicanize-content.ts`
- `scripts/seed-bulk-mexico.ts` and feed seeders
- README + legal copy


## Status (2026-09-15)
- [x] Copy `frontend/` + `backend/` (+ scripts, supabase, workers) from ZyeuteV5
- [x] `config/region.ts` Mexico pack
- [x] Point examples at MexicoV5 (`oqaswdsyqyecufdmwmxs`) — do not use Zyeuté keys
- [x] Locale `es-MX`, timezone `America/Mexico_City`
- [x] `mexicanizer.ts`, `mexicanize-content.ts`, `seed-bulk-mexico.ts`
- [x] Wire the pack: `hive.ts`, `factory.ts`, `mexicoFeatures.ts`, `useSEO.ts`, Language + Region settings, English `en` locale
- [x] Additive Zyeute tables on MexicoV5 (`user_profiles`, `publications`) synced from live Ojea `profiles` / `clips` — did not replace Ojea tables
- [x] Deploy API on Render as **ojea-api** (`https://ojea-api.onrender.com`) — backend-only build, MexicoV5 env
