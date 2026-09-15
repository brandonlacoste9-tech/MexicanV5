/**
 * Turn the Nitro SSR build into a static Netlify site.
 *
 * ojea-mexico's serverless handler 500s on every HTML route
 * (`{"status":500,"unhandled":true,"message":"HTTPError"}`). Ojea is a
 * client-side app (Supabase + zustand) — it does not need that function.
 *
 * Run after `vite build` with NITRO_PRESET=netlify:
 *   1. Render key routes through the local Node handler
 *   2. Write real HTML into dist/
 *   3. Add a SPA fallback
 *   4. Delete the function so Netlify cannot catch-all to a 500
 */
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const handlerPath = join(root, ".netlify/functions-internal/server/server.mjs");
if (!existsSync(handlerPath)) {
  console.error("[netlify-spa] missing", handlerPath);
  process.exit(1);
}

const { default: handler } = await import(pathToFileURL(handlerPath).href);
if (typeof handler !== "function") {
  console.error("[netlify-spa] server export is not a fetch handler");
  process.exit(1);
}

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

for (const [path, file] of routes) {
  const res = await handler(
    new Request(`https://ojea-mexico.netlify.app${path}`, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        host: "ojea-mexico.netlify.app",
      },
    }),
  );
  const html = await res.text();
  if (path === "/" && (res.status !== 200 || !html.includes("<html"))) {
    throw new Error(
      `[netlify-spa] ${path} -> ${res.status} ${html.slice(0, 240)}`,
    );
  }
  if (res.status !== 200 || !html.includes("<html")) {
    console.warn("[netlify-spa] skip", path, res.status);
    continue;
  }
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), html);
  console.log("[netlify-spa]", path, "->", file, html.length, "bytes");
}

mkdirSync(join(root, "dist/__grok"), { recursive: true });
writeFileSync(
  join(root, "dist/__grok/manifest.webmanifest"),
  JSON.stringify(
    {
      name: "Ojea",
      short_name: "Ojea",
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
