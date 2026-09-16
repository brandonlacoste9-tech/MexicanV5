import { region } from "./region";
import { SEED_CLIPS } from "./clips";

export const SITE = region.siteUrl;

export const SEO = {
  title: "Otealo — ¿Y allá cómo está?",
  description:
    "Clips de la calle mexicana: tu ciudad, este sonido, esta hora. El video que mandas cuando preguntan ¿y allá cómo está?",
  googleSiteVerification: "rBGuBEps1Bo24o403e1P6Vl2C5Q5iuDXYrS1VN56TZo",
};

const SPAIN_CITIES = new Set([
  "Madrid",
  "Sevilla",
  "Granada",
  "Barcelona",
  "Buñol",
  "Santiago de Compostela",
]);

export function pageTitle(piece?: string) {
  return piece ? `${piece} · Otealo` : SEO.title;
}

export function absUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function seoHead({
  path,
  title,
  description,
  image,
  noIndex,
}: {
  path: string;
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}) {
  const url = absUrl(path);
  const fullTitle = pageTitle(title);
  const desc = description ?? SEO.description;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: desc },
      { name: "robots", content: noIndex ? "noindex,nofollow" : "index,follow" },
      { name: "author", content: "Otealo" },
      { name: "google-site-verification", content: SEO.googleSiteVerification },
      { property: "og:locale", content: "es_MX" },
      ...(image
        ? [
            { name: "twitter:image", content: absUrl(image) },
            { property: "og:image", content: absUrl(image) },
          ]
        : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function clipSeo(id: string) {
  const clip = SEED_CLIPS.find((item) => item.id === id);
  if (!clip || (clip.city && SPAIN_CITIES.has(clip.city))) {
    return seoHead({
      path: `/c/${encodeURIComponent(id)}`,
      title: "Clip",
      description: SEO.description,
    });
  }
  const title = `${clip.city} · ${clip.sound}`;
  const description = `${clip.caption} — ${clip.city}, México. En Otealo.`;
  return seoHead({
    path: `/c/${encodeURIComponent(id)}`,
    title,
    description,
    image: clip.image,
  });
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Otealo",
  alternateName: "¿Y allá cómo está?",
  url: SITE,
  inLanguage: "es-MX",
  description: SEO.description,
  areaServed: { "@type": "Country", name: "Mexico" },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE}/buscar?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};
