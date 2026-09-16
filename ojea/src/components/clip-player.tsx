import { Pause } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import type { Clip } from "@/lib/clips";
import { clipVideoSrc, localClipVideoUrl } from "@/lib/media";
import { useOjea } from "@/lib/store";

function coverFit(video: HTMLVideoElement, box: HTMLElement) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const cw = box.clientWidth;
  const ch = box.clientHeight;
  if (!vw || !vh || !cw || !ch) return false;
  const scale = Math.max(cw / vw, ch / vh);
  const w = Math.round(vw * scale);
  const h = Math.round(vh * scale);
  video.style.width = `${w}px`;
  video.style.height = `${h}px`;
  video.style.left = `${Math.round((cw - w) / 2)}px`;
  video.style.top = `${Math.round((ch - h) / 2)}px`;
  return true;
}

export function ClipPlayer({
  clip,
  active,
  near,
  holding,
}: {
  clip: Clip;
  active: boolean;
  near: boolean;
  holding?: boolean;
}) {
  const { muted, paused } = useOjea();
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [fitted, setFitted] = useState(false);
  const hosted = clipVideoSrc(clip);
  const [src, setSrc] = useState(hosted);
  const attach = Boolean(src) && !failed && (active || near);

  function fit() {
    const video = videoRef.current;
    const box = boxRef.current;
    if (!video || !box) return;
    if (coverFit(video, box)) setFitted(true);
  }

  useEffect(() => {
    setSrc(hosted);
    setFailed(false);
    setProgress(0);
    setFitted(false);
  }, [hosted]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => fit());
    ro.observe(box);
    return () => ro.disconnect();
  }, [attach, src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active && !paused) {
      void el.play().catch(() => {
        /* autoplay can fail until a gesture; mute stays on by default */
      });
    } else {
      el.pause();
      if (!active && !near) {
        el.currentTime = 0;
        setProgress(0);
      }
    }
  }, [active, paused, src, attach, near]);

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = muted;
  }, [muted, attach]);

  function seekFromEvent(e: PointerEvent<HTMLDivElement>) {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    setProgress(ratio);
  }

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden bg-bg">
      {attach ? (
        <video
          ref={videoRef}
          src={src ?? undefined}
          className={cn("clip-video", fitted && "is-fit")}
          loop
          muted={muted}
          playsInline
          preload={active ? "auto" : "metadata"}
          disablePictureInPicture
          controls={false}
          onLoadedMetadata={fit}
          onLoadedData={fit}
          onWaiting={() => setBuffering(true)}
          onPlaying={() => {
            setBuffering(false);
            fit();
          }}
          onCanPlay={() => {
            setBuffering(false);
            fit();
          }}
          onError={() => {
            const local = localClipVideoUrl(clip.id);
            if (src && src !== local) setSrc(local);
            else setFailed(true);
          }}
          onTimeUpdate={(e) => {
            if (seeking) return;
            const v = e.currentTarget;
            if (v.duration) setProgress(v.currentTime / v.duration);
          }}
        />
      ) : null}

      {!fitted ? (
        <img
          src={clip.image}
          alt=""
          className="absolute inset-0 z-[1] size-full object-cover"
        />
      ) : null}

      {buffering && active ? <span className="clip-buffer" aria-hidden /> : null}

      {paused && active && !holding ? (
        <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <Pause className="size-14 text-fg/80" />
        </span>
      ) : null}

      {attach && active ? (
        <div
          className={cn("clip-seek", seeking && "is-active")}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            setSeeking(true);
            seekFromEvent(e);
          }}
          onPointerMove={(e) => {
            if (!seeking && !(e.buttons & 1)) return;
            seekFromEvent(e);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            setSeeking(false);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="clip-seek-track">
            <div
              className="clip-seek-fill"
              style={{ width: `${Math.round(progress * 1000) / 10}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
