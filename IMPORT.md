# How this repo was built

MexicanV5 is the **ZyeuteV5 stack** with a Mexico region pack. It is not a rewrite.

```bash
# What we did:
# 1. Copied frontend/, backend/, scripts/, supabase/, workers/ from ZyeuteV5
# 2. Swapped config/region.ts to es-MX / America/Mexico_City
# 3. Renamed joualizer → mexicanizer, quebecify → mexicanize, seed-bulk-quebec → seed-bulk-mexico
# 4. Pointed .env.example at MexicoV5 (oqaswdsyqyecufdmwmxs)
```

Do **not** import Zyeuté Supabase keys. Use MexicoV5 only.

The static HTML prototype from before the copy lives in `demo/`.
