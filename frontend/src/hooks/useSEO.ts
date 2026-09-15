/**
 * useSEO — per-page meta for Ojea (México).
 */
import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile" | "video.other";
  jsonLd?: Record<string, unknown>;
  noIndex?: boolean;
}

const DEFAULT_TITLE = "Ojea — Videos de México";
const DEFAULT_DESC =
  "App de videos cortos de México. Talento de aquí: CDMX, Guadalajara, Monterrey, playa y calle.";
const DEFAULT_IMAGE = "https://ojea-mexico.netlify.app/ojea_og_image.png";
const BASE_URL = "https://ojea-mexico.netlify.app";

function setMeta(property: string, content: string, isName = false) {
  const attr = isName ? "name" : "property";
  let el = document.querySelector<HTMLMetaElement>(
    `meta[${attr}="${property}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({
  title,
  description,
  image,
  url,
  type = "website",
  jsonLd,
  noIndex = false,
}: SEOProps = {}) {
  const fullTitle = title ? `${title} | Ojea` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESC;
  const img = image || DEFAULT_IMAGE;
  const pageUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  useEffect(() => {
    document.title = fullTitle;
    setMeta("description", desc, true);
    setMeta(
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
      true,
    );
    setMeta("og:title", fullTitle);
    setMeta("og:description", desc);
    setMeta("og:image", img);
    setMeta("og:url", pageUrl);
    setMeta("og:type", type);
    setMeta("og:locale", "es_MX");
    setMeta("twitter:card", "summary_large_image", true);
    setMeta("twitter:title", fullTitle, true);
    setMeta("twitter:description", desc, true);
    setMeta("twitter:image", img, true);
    setLink("canonical", pageUrl);

    const existing = document.getElementById("ojea-jsonld");
    if (existing) existing.remove();
    if (jsonLd) {
      const s = document.createElement("script");
      s.id = "ojea-jsonld";
      s.type = "application/ld+json";
      s.text = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [fullTitle, desc, img, pageUrl, type, jsonLd, noIndex]);
}
