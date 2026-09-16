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

function absUrl(raw, origin) {
  if (!raw) return `${origin}/favicon.svg`;
  if (raw.startsWith("http")) return raw;
  return `${origin}${raw.startsWith("/") ? raw : `/${raw}`}`;
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
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:image" content="${image}"/>
`;
  let next = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  if (next.includes("</head>")) next = next.replace("</head>", `${tags}</head>`);
  return next;
}

function clipId(event) {
  const raw = event.path || event.rawPath || "";
  const fromPath = raw.split("/c/")[1] || "";
  const id = decodeURIComponent(fromPath.split("/")[0] || "").trim();
  if (id) return id;
  const splat = event.queryStringParameters?.splat;
  return splat ? decodeURIComponent(splat).split("/")[0] : "";
}

export async function handler(event) {
  const origin = `https://${event.headers.host || "otealo.com"}`;
  const id = clipId(event);
  let meta = {
    title: "Otealo",
    description: "Videos cortos hechos en México, para México.",
    url: id ? `${SITE}/c/${encodeURIComponent(id)}` : SITE,
    image: `${origin}/favicon.svg`,
  };

  if (id) {
    try {
      const catRes = await fetch(`${origin}/clip-og.json`);
      if (catRes.ok) {
        const catalog = await catRes.json();
        if (catalog[id]) meta = catalog[id];
      }
    } catch {
      /* seed catalog optional */
    }
    if (meta.title === "Otealo") {
      try {
        const res = await fetch(
          `${SUPA}/rest/v1/clips?id=eq.${encodeURIComponent(id)}&select=id,username,display_name,caption,city,image`,
          {
            headers: {
              apikey: ANON,
              Authorization: `Bearer ${ANON}`,
            },
          },
        );
        const rows = res.ok ? await res.json() : [];
        const row = rows[0];
        if (row) {
          meta = {
            title: row.caption || `@${row.username} en Otealo`,
            description: `@${row.username} · ${row.city || "México"} · Otealo`,
            url: `${SITE}/c/${encodeURIComponent(id)}`,
            image: absUrl(row.image, origin),
          };
        }
      } catch {
        /* keep default */
      }
    }
  }

  let shell = "";
  try {
    const home = await fetch(`${origin}/`);
    shell = home.ok ? await home.text() : "";
  } catch {
    shell = "";
  }
  if (!shell.includes("<html")) {
    shell = `<!DOCTYPE html><html lang="es-MX"><head><meta charset="utf-8"/><title>Otealo</title></head><body><script>location.replace("/?v=${encodeURIComponent(id)}")</script></body></html>`;
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
    body: injectOg(shell, meta),
  };
}
