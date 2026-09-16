/**
 * Turn the Nitro SSR build into a static Netlify site.
 *
 * otealo.com's serverless handler 500s on every HTML route
 * (`{"status":500,"unhandled":true,"message":"HTTPError"}`). Otealo is a
 * client-side app (Supabase + zustand) — it does not need that function.
 *
 * Run after `vite build` with NITRO_PRESET=netlify.
 */
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  existsSync,
  readdirSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();

// Neon-on-Netlify injects DATABASE_URL. Otealo does not use it; leave it
// unset so SSR at build time cannot hang on a remote Postgres.
delete process.env.DATABASE_URL;

const routes = [
  ["/", "dist/index.html"],
  ["/explorar", "dist/explorar/index.html"],
  ["/buscar", "dist/buscar/index.html"],
  ["/entrar", "dist/entrar/index.html"],
  ["/registro", "dist/registro/index.html"],
  ["/perfil", "dist/perfil/index.html"],
  ["/inbox", "dist/inbox/index.html"],
  ["/crear", "dist/crear/index.html"],
  ["/ajustes", "dist/ajustes/index.html"],
  ["/comunidad", "dist/comunidad/index.html"],
  ["/privacidad", "dist/privacidad/index.html"],
  ["/terminos", "dist/terminos/index.html"],
  ["/recuperar", "dist/recuperar/index.html"],
];

function firstExisting(paths) {
  return paths.find((p) => existsSync(p));
}

const SITE = "https://otealo.com";
const SUPA = "https://oqaswdsyqyecufdmwmxs.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xYXN3ZHN5cXllY3VmZG13bXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTkxODIsImV4cCI6MjEwNTA3NTE4Mn0.CgBZFnuxnXFmEKMSuRyr8zOoBITB0MUMtbRsxw7rT2E";

function esc(value) {
  return String(value)
    .replaceAll("&", "&")
    .replaceAll("<", "<")
    .replaceAll(">", ">")
    .replaceAll('"', """);
}

function absUrl(raw) {
  if (!raw) return `${SITE}/favicon.svg`;
  if (raw.startsWith("http")) return raw;
  return `${SITE}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

function injectOg(html, meta) {
  const title = esc(meta.title);
  const description = esc(meta.description);
  const url = esc(meta.url);
  const image = esc(meta.image);
  const tags = `
  <meta property="og:type" content="video.other"/>
  <meta property="og:site_name" content="Otealo"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:image" content="${image}"/>
  <meta property="og:image:alt" content="${title}"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image" content="${image}"/>
`;
  let next = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  if (next.includes("</head>")) next = next.replace("</head>", `${tags}</head>`);
  else next = tags + next;
  return next;
}

function parseLocalClips() {
  const catalog = {};
  const files = [
    join(root, "src/lib/mx-clips.ts"),
    join(root, "src/lib/clips.ts"),
  ];
  for (const file of files) {
    if (!existsSync(file)) continue;
    const src = readFileSync(file, "utf8");
    const blockRe =
      /\{\s*id:\s*"([^"]+)"[\s\S]*?user:\s*"([^"]+)"[\s\S]*?displayName:\s*"([^"]+)"[\s\S]*?caption:\s*"([^"]*)"[\s\S]*?city:\s*"([^"]+)"[\s\S]*?image:\s*([^\n]+)/g;
    let match;
    while ((match = blockRe.exec(src))) {
      const [, id, user, displayName, caption, city, imageExpr] = match;
      let image = `${SITE}/favicon.svg`;
      const mx = imageExpr.match(
        /mxClipImageUrl\("([^"]+)"(?:,\s*"(jpg|png)")?\)/,
      );
      const local = imageExpr.match(/"(\/clips\/[^"]+)"/);
      const remote = imageExpr.match(/"(https?:\/\/[^"]+)"/);
      if (mx) {
        image = `${SUPA}/storage/v1/object/public/clips/mx/${mx[1]}.${mx[2] || "jpg"}`;
      } else if (local) {
        image = absUrl(local[1]);
      } else if (remote) {
        image = remote[1];
      }
      catalog[id] = {
        title: caption || `@${user} en Otealo`,
        description: `@${user} · ${city} · Otealo`,
        image,
        url: `${SITE}/c/${encodeURIComponent(id)}`,
        user,
        displayName,
        city,
      };
    }
  }
  return catalog;
}

async function loadRemoteClips(catalog) {
  try {
    const res = await fetch(
      `${SUPA}/rest/v1/clips?select=id,username,display_name,caption,city,image&limit=200`,
      {
        headers: {
          apikey: ANON,
          Authorization: `Bearer ${ANON}`,
        },
      },
    );
    if (!res.ok) return;
    const rows = await res.json();
    for (const row of rows) {
      if (!row?.id || catalog[row.id]) continue;
      catalog[row.id] = {
        title: row.caption || `@${row.username} en Otealo`,
        description: `@${row.username} · ${row.city || "México"} · Otealo`,
        image: absUrl(row.image),
        url: `${SITE}/c/${encodeURIComponent(row.id)}`,
        user: row.username,
        displayName: row.display_name,
        city: row.city,
      };
    }
  } catch (err) {
    console.warn("[netlify-spa] clip catalog supabase skipped", err);
  }
}

async function writeClipOgPages() {
  const catalog = parseLocalClips();
  await loadRemoteClips(catalog);
  const shellPath = join(root, "dist/index.html");
  if (!existsSync(shellPath)) return;
  const shell = readFileSync(shellPath, "utf8");
  writeFileSync(
    join(root, "dist/clip-og.json"),
    JSON.stringify(catalog),
  );
  let n = 0;
  for (const [id, meta] of Object.entries(catalog)) {
    const dir = join(root, "dist/c", id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), injectOg(shell, meta));
    n += 1;
  }
  console.log("[netlify-spa] wrote", n, "clip OG pages");
}

async function loadFetcher() {
  const ssrPath = firstExisting([
    join(root, ".netlify/functions-internal/server/_ssr/ssr.mjs"),
    join(root, "node_modules/.nitro/vite/services/ssr/index.js"),
  ]);
  if (ssrPath) {
    const mod = await import(pathToFileURL(ssrPath).href);
    const entry = mod.default?.fetch
      ? mod.default
      : mod.t?.default?.fetch
        ? mod.t.default
        : mod.t?.fetch
          ? mod.t
          : null;
    if (entry?.fetch) {
      console.log("[netlify-spa] using SSR entry", ssrPath);
      return (req) => entry.fetch(req);
    }
  }

  const handlerPath = firstExisting([
    join(root, ".netlify/functions-internal/server/server.mjs"),
    join(root, ".netlify/functions-internal/server/main.mjs"),
  ]);
  if (handlerPath) {
    const mod = await import(pathToFileURL(handlerPath).href);
    if (typeof mod.default === "function") {
      console.log("[netlify-spa] using Nitro handler", handlerPath);
      return mod.default;
    }
  }

  throw new Error(
    `[netlify-spa] no SSR entry (cwd=${root} netlify=${existsSync(join(root, ".netlify"))})`,
  );
}

function writeAssetFallback() {
  const dir = join(root, "dist/assets");
  const files = existsSync(dir) ? readdirSync(dir) : [];
  const indexJs = files.find((f) => /^index-.*\.js$/.test(f));
  const css = files.filter((f) => f.endsWith(".css"));
  if (!indexJs) {
    throw new Error("[netlify-spa] no dist/assets/index-*.js for fallback");
  }
  const cssLinks = css
    .map((f) => `<link rel="stylesheet" href="/assets/${f}"/>`)
    .join("\n");
  const html = `<!DOCTYPE html>
<html lang="es-MX" class="antialiased">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Otealo</title>
  <meta name="description" content="Videos cortos hechos en México, para México."/>
  <meta name="theme-color" content="#0d0c0b"/>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
  ${cssLinks}
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Outfit:wght@400;500;600&display=swap"/>
</head>
<body>
<script>
(self.$R=self.$R||{})["tsr"]=[];
self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]};
$_TSR.router={manifest:{routes:{__root__:{preloads:["/assets/${indexJs}"],scripts:[{attrs:{type:"module",async:!0,src:"/assets/${indexJs}"}}]}}},matches:[{i:"__root__",u:Date.now(),s:"success",ssr:!0}]};
$_TSR.e();
</script>
<script type="module" async src="/assets/${indexJs}"></script>
</body>
</html>
`;
  mkdirSync(join(root, "dist"), { recursive: true });
  writeFileSync(join(root, "dist/index.html"), html);
  console.log("[netlify-spa] wrote asset fallback index.html via", indexJs);
}

let wroteHome = false;
try {
  const fetchDoc = await loadFetcher();
  for (const [path, file] of routes) {
    try {
      const res = await fetchDoc(
        new Request(`https://otealo.com${path}`, {
          headers: {
            accept: "text/html,application/xhtml+xml",
            host: "otealo.com",
          },
        }),
      );
      const html = await res.text();
      if (res.status !== 200 || !html.includes("<html")) {
        console.warn("[netlify-spa] skip", path, res.status);
        continue;
      }
      mkdirSync(dirname(join(root, file)), { recursive: true });
      writeFileSync(join(root, file), html);
      console.log("[netlify-spa]", path, "->", file, html.length, "bytes");
      if (path === "/") wroteHome = true;
    } catch (err) {
      console.warn("[netlify-spa] skip", path, err);
    }
  }
} catch (err) {
  console.error("[netlify-spa] renderer failed:", err);
}

if (!wroteHome && !existsSync(join(root, "dist/index.html"))) {
  writeAssetFallback();
  wroteHome = true;
}

if (!existsSync(join(root, "dist/index.html"))) {
  throw new Error("[netlify-spa] failed to produce dist/index.html");
}

function retitle(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === "assets" || name.name === "clips") continue;
      retitle(p);
      continue;
    }
    if (!name.name.endsWith(".html")) continue;
    const html = readFileSync(p, "utf8");
    const next = html
      .replaceAll("<title>Ojea</title>", "<title>Otealo</title>")
      .replaceAll("Ojea —", "Otealo —")
      .replaceAll("name: \"Ojea\"", "name: \"Otealo\"");
    if (next !== html) {
      writeFileSync(p, next);
      console.log("[netlify-spa] retitled", p);
    }
  }
}
retitle(join(root, "dist"));
try {
  await writeClipOgPages();
} catch (err) {
  console.warn("[netlify-spa] clip OG pages skipped", err);
}

mkdirSync(join(root, "dist/__grok"), { recursive: true });
writeFileSync(
  join(root, "dist/__grok/manifest.webmanifest"),
  JSON.stringify(
    {
      name: "Otealo",
      short_name: "Otealo",
      description: "Videos cortos hechos en México, para México.",
      start_url: "/",
      display: "standalone",
      background_color: "#0d0c0b",
      theme_color: "#0d0c0b",
      lang: "es-MX",
      icons: [
        { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
        { src: "/__grok/icon-180.png", sizes: "180x180", type: "image/png" },
      ],
    },
    null,
    2,
  ),
);

writeFileSync(
  join(root, "dist/_redirects"),
  `# Clip permalinks: static dist/c/{id}/index.html wins; unknown ids hit the OG function.
/c/*  /.netlify/functions/clip-card  200
# SPA fallback — static files win over this rewrite.
/*    /index.html   200
`,
);

if (process.env.NETLIFY || process.env.NETLIFY_SPA_DROP_FUNCTIONS === "1") {
  rmSync(join(root, ".netlify/functions-internal"), {
    recursive: true,
    force: true,
  });
  console.log("[netlify-spa] dropped functions-internal (static host)");
}
