import { Pause } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import type { Clip } from "@/lib/clips";
import { clipVideoSrc, localClipVideoUrl } from "@/lib/media";
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
  const [ready, setReady] = useState(false);
  const hosted = clipVideoSrc(clip);
  const [src, setSrc] = useState(hosted);
  const attach = Boolean(src) && !failed && (active || near);

  useEffect(() => {
    setSrc(hosted);
    setFailed(false);
    setProgress(0);
    setReady(false);
  }, [hosted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.setAttribute("playsinline", "true");
    el.setAttribute("webkit-playsinline", "true");
    el.setAttribute("x5-playsinline", "true");
    el.setAttribute("x5-video-player-type", "h5");
    el.setAttribute("x5-video-player-fullscreen", "false");
    el.playsInline = true;
    el.muted = muted;
  }, [attach, muted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active && !paused) {
      const tryPlay = () => {
        const p = el.play();
        if (p) {
          void p.catch(() => {
            el.muted = true;
            void el.play().catch(() => {});
          });
        }
      };
      tryPlay();
    } else {
      el.pause();
      if (!active && !near) {
        el.currentTime = 0;
        setProgress(0);
      }
    }
  }, [active, paused, src, attach, near]);

  function seekFromEvent(e: PointerEvent<HTMLDivElement>) {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    setProgress(ratio);
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      {attach ? (
        <video
          ref={videoRef}
          src={src ?? undefined}
          className="clip-video"
          loop
          muted={muted}
          autoPlay={active && !paused}
          playsInline
          preload={active ? "auto" : "metadata"}
          disablePictureInPicture
          controls={false}
          onLoadedData={() => setReady(true)}
          onPlaying={() => {
            setBuffering(false);
            setReady(true);
          }}
          onWaiting={() => setBuffering(true)}
          onCanPlay={() => setBuffering(false)}
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

      {!ready ? (
        <img
          src={clip.image}
          alt=""
          className="absolute inset-0 z-[1] size-full object-contain bg-bg"
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
