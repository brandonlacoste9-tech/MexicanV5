import type { Clip } from "./clips";

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i;

export function isVideoUrl(url?: string | null) {
  if (!url) return false;
  return VIDEO_EXT.test(url);
}

export function clipVideoSrc(clip: Clip) {
  if (clip.video) return clip.video;
  if (isVideoUrl(clip.image)) return clip.image;
  return null;
}
