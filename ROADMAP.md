# Best move

Do **not** rewrite ZyeuteV5. Copy it into MexicanV5, then swap a region pack.

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
- `backend/services/joualizer.ts` → `mexicanizer.ts`
- `scripts/quebecify-content.ts` → `mexicanize-content.ts`
- `scripts/seed-bulk-quebec.ts` and feed seeders
- README + legal copy
