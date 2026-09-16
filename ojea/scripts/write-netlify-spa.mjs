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
  `# SPA fallback — static files win over this rewrite.
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
