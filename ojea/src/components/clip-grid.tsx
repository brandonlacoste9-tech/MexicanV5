import { useNavigate } from "@tanstack/react-router";
import { Play } from "lucide-react";
import type { Clip } from "@/lib/clips";
import { useCopy } from "@/lib/i18n";
import { clipVideoSrc } from "@/lib/media";
import { formatCount, useOjea } from "@/lib/store";

export function ClipGrid({ clips }: { clips: Clip[] }) {
  const { setIndex, setTab, clips: all } = useOjea();
  const navigate = useNavigate();
  const t = useCopy();

  if (clips.length === 0) {
    return <p className="mt-4 text-sm text-muted">{t.emptyGrid}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {clips.map((clip) => (
        <button
          key={clip.id}
          type="button"
          className="group relative aspect-portrait overflow-hidden rounded-lg"
          aria-label={`@${clip.user}`}
          onClick={() => {
            const idx = all.findIndex((x) => x.id === clip.id);
            setTab("foryou");
            setIndex(idx >= 0 ? idx : 0);
            void navigate({ to: "/" });
          }}
        >
          <img
            src={clip.image}
            alt=""
            className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          {clipVideoSrc(clip) ? (
            <span className="absolute top-2 right-2 grid size-8 place-items-center rounded-full border border-border bg-bg/55">
              <Play className="size-3.5 fill-fg text-fg" />
            </span>
          ) : null}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg to-transparent p-3 text-left">
            <span className="block truncate text-xs">@{clip.user}</span>
            <span className="mt-0.5 flex items-center gap-1 text-[11px] text-fg/80">
              <Play className="size-3 fill-fg/80" />
              {formatCount(clip.likes * 8 + clip.comments.length * 40)}
            </span>
          </span>
          {clip.live ? (
            <span className="absolute top-2 left-2 rounded-full bg-live px-2 py-0.5 text-xs font-medium text-fg">
              {t.liveShort}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}