import { Pause } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import type { Clip } from "@/lib/clips";
import { clipVideoSrc } from "@/lib/media";
import { useOjea } from "@/lib/store";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const src = clipVideoSrc(clip);
  const showVideo = Boolean(src) && !failed && (active || near);

  useEffect(() => {
    setFailed(false);
    setProgress(0);
  }, [src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active && !paused) {
      void el.play().catch(() => {
        /* autoplay can fail until a gesture; mute stays on by default */
      });
    } else {
      el.pause();
      if (!active) {
        el.currentTime = 0;
        setProgress(0);
      }
    }
  }, [active, paused, src, showVideo]);

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = muted;
  }, [muted, showVideo]);

  function seekFromEvent(e: PointerEvent<HTMLDivElement>) {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    setProgress(ratio);
  }

  return (
    <>
      <img
        src={clip.image}
        alt=""
        className={cn(
          "absolute inset-0 size-full object-cover",
          !showVideo && "clip-ken",
          !showVideo && paused && "is-paused",
        )}
      />
      {showVideo ? (
        <video
          ref={videoRef}
          src={src ?? undefined}
          poster={clip.image}
          className="absolute inset-0 size-full object-cover"
          loop
          playsInline
          muted={muted}
          preload={active ? "auto" : "metadata"}
          onWaiting={() => setBuffering(true)}
          onPlaying={() => setBuffering(false)}
          onCanPlay={() => setBuffering(false)}
          onError={() => setFailed(true)}
          onTimeUpdate={(e) => {
            if (seeking) return;
            const v = e.currentTarget;
            if (v.duration) setProgress(v.currentTime / v.duration);
          }}
        />
      ) : null}

      {buffering && active ? <span className="clip-buffer" aria-hidden /> : null}

      {paused && active && !holding ? (
        <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <Pause className="size-14 text-fg/80" />
        </span>
      ) : null}

      {showVideo && active ? (
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
    </>
  );
}
