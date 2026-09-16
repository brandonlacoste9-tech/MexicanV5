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
  const [playing, setPlaying] = useState(false);
  const hosted = clipVideoSrc(clip);
  const [src, setSrc] = useState(hosted);
  const phone =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  const attach = Boolean(src) && !failed && (active || (!phone && near));

  useEffect(() => {
    setSrc(hosted);
    setFailed(false);
    setProgress(0);
    setPlaying(false);
  }, [hosted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active && !paused) {
      const play = el.play();
      if (play) {
        void play
          .then(() => setPlaying(true))
          .catch(() => {
            /* autoplay can fail until a gesture; mute stays on by default */
          });
      }
    } else {
      el.pause();
      setPlaying(false);
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
    <div className="absolute inset-0 overflow-hidden bg-bg">
      {attach ? (
        <video
          ref={videoRef}
          src={src ?? undefined}
          className="clip-video"
          loop
          muted={muted}
          playsInline
          preload={active ? "auto" : "metadata"}
          disablePictureInPicture
          controls={false}
          onWaiting={() => setBuffering(true)}
          onPlaying={() => {
            setBuffering(false);
            setPlaying(true);
          }}
          onCanPlay={() => setBuffering(false)}
          onPause={() => {
            if (!active || paused) setPlaying(false);
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

      {!playing ? (
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
