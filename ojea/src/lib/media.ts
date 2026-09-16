import type { Clip } from "./clips";
import { SUPABASE_URL } from "./supabase";

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i;
const LOCAL_CLIP = /^\/clips\/([^/?#]+)\.(mp4|webm|mov|m4v)$/i;

export function isVideoUrl(url?: string | null) {
  if (!url) return false;
  return VIDEO_EXT.test(url);
}

/** Public MexicoV5 Storage URL for a seed clip. */
export function seedClipVideoUrl(id: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/clips/seed/${encodeURIComponent(id)}.mp4?v=9x16`;
}

/** Public MexicoV5 Storage URL for a Mexico hashtag clip. */
export function mxClipVideoUrl(id: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/clips/mx/${encodeURIComponent(id)}.mp4`;
}

export function mxClipImageUrl(id: string, ext: "jpg" | "png" = "jpg") {
  return `${SUPABASE_URL}/storage/v1/object/public/clips/mx/${encodeURIComponent(id)}.${ext}`;
}

export function localClipVideoUrl(id: string) {
  return `/clips/${id}.mp4`;
}

export function clipVideoSrc(clip: Clip) {
  const raw = clip.video || (isVideoUrl(clip.image) ? clip.image : null);
  if (!raw) return seedClipVideoUrl(clip.id);
  const local = raw.match(LOCAL_CLIP);
  if (local) return seedClipVideoUrl(local[1]);
  return raw;
}
