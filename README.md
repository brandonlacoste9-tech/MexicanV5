# MexicanV5 — Ojea

TikTok-style short video app for **Mexico**, in **Spanish (`es-MX`)** + English.

This repo is the **ZyeuteV5 stack** with a Mexico region pack. Same frontend/backend — not a rewrite.

Fork of [ZyeuteV5](https://github.com/brandonlacoste9-tech/ZyeuteV5) (Québec / fr-CA).

## Brand
- Name: **Ojea**
- Locale: `es-MX` (UI also has English)
- Timezone: `America/Mexico_City`
- Region pack: [`config/region.ts`](config/region.ts)
- Database: **MexicoV5** Supabase (`oqaswdsyqyecufdmwmxs`) — never Zyeuté keys

## Stack (unchanged)
- Frontend: React + Vite + Tailwind
- Backend: Express + Socket.io
- DB: Supabase / PostgreSQL
- Host: Netlify (web) + Render (API)

## Run
```bash
cp .env.example .env
# Fill MexicoV5 URL + anon + service role. Do not paste Zyeuté secrets.
npm install
npm run dev:frontend   # Vite UI
npm run dev            # Express API
```

Seed Mexico tags:
```bash
npm run seed:bulk
```

## What changed from Zyeute
| Québec | México |
| --- | --- |
| `fr-CA` / America/Montreal | `es-MX` / America/Mexico_City |
| `joualizer.ts` | `mexicanizer.ts` |
| `mexicanize-content.ts` | `mexicanize-content.ts` |
| `seed-bulk-mexico.ts` | `seed-bulk-mexico.ts` |
| `#montreal` `#quebec` | `#cdmx` `#mexico` `#parati` |

Prototype static demo (pre-copy) lives in [`demo/`](demo/).
Live Grok preview Ojea (TanStack) is separate and stays up.

## Legal
See frontend legal routes after you run the Vite app. Do not reuse Zyeuté terms as-is in production without a Mexico pass.
