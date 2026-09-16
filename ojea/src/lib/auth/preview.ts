/**
 * Shared LIVE-PREVIEW OAuth client (server-only — NEVER import from the client).
 *
 * Production (otealo.com) uses Supabase Google, not this broker.
 * The preview secret is read from env so it is not committed.
 * Sandbox live preview: set GROK_PREVIEW_CLIENT_SECRET (or GROK_AUTH_CLIENT_SECRET).
 */
export const PREVIEW_CLIENT_ID = "grok_preview";

export const PREVIEW_CLIENT_SECRET =
  (typeof process !== "undefined" &&
    (process.env.GROK_PREVIEW_CLIENT_SECRET ||
      process.env.GROK_AUTH_CLIENT_SECRET)?.trim()) ||
  "";

/** The shared auth broker issuer (OIDC discovery lives under it). */
export const GROK_ISSUER_DEFAULT = "https://auth.grok.me";

export const PREVIEW_ALLOWED_HOSTS = ["*.grok-sandbox.com"] as const;
