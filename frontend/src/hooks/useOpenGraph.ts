/**
 * useOpenGraph - Dynamically sets Open Graph meta tags for post sharing
 * Call this in PostDetail.tsx with the post data
 */
import { useEffect } from "react";
import type { Post } from "@/types";

export function useOpenGraph(post: Post | null) {
  useEffect(() => {
    if (!post) return;

    const title = post.caption
      ? `${post.caption.slice(0, 60)} — Ojea`
      : "Ojea — La plateforme mexicana";
    const description =
      post.caption ||
      "Découvrez ce contenu sur Ojea, la plateforme vidéo mexicana.";
    const DEFAULT_OG_IMAGE = "https://ojea-mexico.netlify.app/ojea_og_image.png";
    const image =
      post.thumbnail_url ||
      (post.mux_playback_id
        ? `https://image.mux.com/${post.mux_playback_id}/thumbnail.jpg?width=600&height=338&fit_mode=smartcrop`
        : DEFAULT_OG_IMAGE);
    // Canonical post path is /p/:id (see AppRoutes)
    const url = `https://ojea-mexico.netlify.app/p/${post.id}`;

    // Helper to set or create meta tag
    const setMeta = (property: string, content: string, attr = "property") => {
      let el = document.querySelector(
        `meta[${attr}="${property}"]`,
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Open Graph
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:image", image);
    setMeta("og:url", url);
    setMeta("og:type", "video.other");
    setMeta("og:site_name", "Ojea");

    // Twitter Card
    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", title, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:image", image, "name");

    // Page title
    const prevTitle = document.title;
    document.title = title;

    // ── VideoObject JSON-LD for Google & AI search ────────────────────────
    const JSON_LD_ID = "ojea-post-jsonld";
    let ldScript = document.getElementById(
      JSON_LD_ID,
    ) as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.id = JSON_LD_ID;
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }

    const videoLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": post.type === "video" ? "VideoObject" : "ImageObject",
      name: title,
      description: description,
      thumbnailUrl: image,
      url: url,
      embedUrl: url,
      uploadDate: post.created_at ?? new Date().toISOString(),
      inLanguage: "es-MX",
    };

    if (post.mux_playback_id) {
      videoLd["contentUrl"] =
        `https://stream.mux.com/${post.mux_playback_id}/high.mp4`;
    }

    if (post.user) {
      videoLd["author"] = {
        "@type": "Person",
        name: post.user.display_name || post.user.username,
        url: `https://ojea-mexico.netlify.app/profile/${post.user.username}`,
      };
    }

    ldScript.textContent = JSON.stringify(videoLd);

    return () => {
      document.title = prevTitle;
      document.getElementById(JSON_LD_ID)?.remove();
    };
  }, [post]);
}
