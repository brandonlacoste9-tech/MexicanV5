# ojea-edge

Cloudflare Worker in front of the Render API:

1. **KV cache** for public GETs (no `Authorization` header)
2. **Stale-while-revalidate** — soft TTL = fresh HIT; past soft still serves `STALE` while refreshing origin
3. **Cron every 3 min** — pings health + warms catalog / profile / guest feed so Render stays awake

| Path                   | Soft | Hard  |
| ---------------------- | ---- | ----- |
| `/api/health`          | 15s  | 60s   |
| catalogs               | 2m   | 10m   |
| `/api/users/:id`       | 45s  | 3m    |
| `/api/users/:id/posts` | 30s  | 2m    |
| `/api/feed` (guest)    | 20s  | 60s   |
| trending / sounds      | 1–2m | 5–10m |

Headers: `X-Ojea-Edge: HIT | STALE | MISS | BYPASS | STALE-ORIGIN-DOWN`

## Deploy

```bash
cd workers/ojea-edge
npx wrangler deploy
```

Vercel rewrites `/api/*` → `https://ojea-edge.brandonlacoste9.workers.dev/api/$1`

## Self-check

```
GET .../__edge/health
GET .../api/health   # then again → HIT
```
