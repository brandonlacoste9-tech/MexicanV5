# Ojeá V5 — Local Development Setup

## Prerequisites

- Node.js 20+
- A Supabase project (free tier works)

## 1. Environment

Copy the example and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Minimum required variables in `.env`:
| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Supabase → Settings → Database → Connection string (Transaction pooler) |
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` key |

Optional but recommended:
| Variable | Purpose |
|---|---|
| `PEXELS_API_KEY` | Stock video fallback in feed — get free at [pexels.com/api](https://pexels.com/api) |
| `MUX_TOKEN_ID` + `MUX_TOKEN_SECRET` | Primary video hosting — get at [dashboard.mux.com](https://dashboard.mux.com) |

## 2. Install dependencies

```bash
npm install
```

## 3. Run database migrations

```bash
npm run migrate
```

This applies all SQL migrations in `backend/migrations/` to your Supabase database.

## 4. Start the app

```bash
npm run dev
```

This starts the Express backend on port **3000** and the Vite dev server on port **5173**.

Open: [http://localhost:5173](http://localhost:5173)

## 5. Seed the feed (first boot)

The app auto-seeds on startup when the feed is empty. Or run it manually:

```bash
curl -X POST http://localhost:3000/api/seed/feed
```

This inserts 10 sample Québec-themed videos into the feed.

## Video Upload Flow

| Method                  | When             | How                                                                    |
| ----------------------- | ---------------- | ---------------------------------------------------------------------- |
| **Mux** (primary)       | MUX_TOKEN_ID set | Drag-and-drop in Studio → chunked upload → Mux webhook → HLS streaming |
| **Surgical** (fallback) | Always available | POST `/api/upload/simple` with multipart form → Supabase Storage       |
| **Seeded** (demo)       | No uploads yet   | POST `/api/seed/feed` → inserts Pexels stock videos                    |

## Common Issues

**Feed shows “demo videos” instead of real content**
→ Check your `.env` has `DATABASE_URL`, `VITE_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` set correctly.
→ Run `npm run migrate` to ensure the database schema is up to date.

**Videos not loading (black screen)**
→ Open browser DevTools → Console. Look for `[SingleVideoView]` logs.
→ Check the `processing_status` column — posts with `pending` status have no URL yet.
→ The Pexels fallback requires `PEXELS_API_KEY`.

**Upload fails**
→ For Mux upload: ensure `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` are set.
→ For surgical upload: ensure `SUPABASE_SERVICE_ROLE_KEY` is set.

**Backend won’t start**
→ Ensure `DATABASE_URL` is set and points to a live Supabase database.
→ Check `PORT` — defaults to `3000`.
