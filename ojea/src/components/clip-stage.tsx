import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Music2, Search } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ClipPlayer } from "@/components/clip-player";
import {
  ActionRail,
  CommentsDock,
  ShareDock,
  StagePager,
  SuggestedAside,
} from "@/components/clip-chrome";
import { LangToggle } from "@/components/lang-toggle";
import { cn } from "@/lib/cn";
import type { Clip } from "@/lib/clips";
import { getLocale, useCopy } from "@/lib/i18n";
import { SERIES, SERIES_LABEL, type SeriesId } from "@/lib/culture";
import { formatCount, useOjea } from "@/lib/store";

export function ClipStage({ clips }: { clips: Clip[] }) {
  const { index, setIndex, tab, setTab, togglePaused, toggleMute, toggleLike, toggleSave, countryFilter, seriesFilter, setCountryFilter, setSeriesFilter } =
    useOjea();
  const c = useCopy();
  const scroller = useRef<HTMLDivElement>(null);
  const [deskPanel, setDeskPanel] = useState<"comments" | "share" | null>(null);

  useLayoutEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const node = root.querySelector(
      `[data-clip-index="${index}"]`,
    ) as HTMLElement | null;
    root.scrollTop = node ? node.offsetTop : 0;
  }, [tab]);

  useEffect(() => {
    setDeskPanel(null);
  }, [index, tab]);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!vis) return;
        const i = Number((vis.target as HTMLElement).dataset.clipIndex);
        if (!Number.isNaN(i)) setIndex(i);
      },
      { root, threshold: 0.65 },
    );
    root.querySelectorAll("[data-clip-index]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [clips, setIndex]);

  const current = clips[Math.min(index, Math.max(0, clips.length - 1))];

  function scrollToIndex(next: number) {
    const node = scroller.current?.querySelector(`[data-clip-index="${next}"]`);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;
      if (typing) return;
      if (e.key === " " || e.key === "k" || e.key === "K") {
        e.preventDefault();
        togglePaused();
        return;
      }
      if (e.key === "m" || e.key === "M") {
        toggleMute();
        return;
      }
      if ((e.key === "l" || e.key === "L") && current) {
        toggleLike(current.id);
        return;
      }
      if ((e.key === "f" || e.key === "F") && current) {
        toggleSave(current.id);
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const next = e.key === "ArrowDown" ? index + 1 : index - 1;
      scrollToIndex(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, togglePaused, toggleMute, toggleLike, toggleSave, current]);

  const emptyCopy =
    tab === "following"
      ? c.followEmpty
      : tab === "friends"
        ? c.friendsEmpty
        : c.liveEmpty;

  return (
    <div className="flex h-svh overflow-hidden md:h-dvh md:items-center md:justify-center md:gap-4 md:px-6">
      <div className="stage-frame min-h-0 shrink-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-3 pt-4 md:px-4">
          <Link
            to="/buscar"
            search={{ q: undefined }}
            aria-label={c.navSearch}
            className="pointer-events-auto grid size-10 place-items-center rounded-full bg-bg/40 text-fg md:invisible"
          >
            <Search className="size-5" />
          </Link>
          <div className="flex justify-center gap-4 pt-1 md:gap-5">
            <StageTab
              label={c.followingTab}
              active={tab === "following"}
              onClick={() => setTab("following")}
            />
            <StageTab
              label={c.navForYou}
              active={tab === "foryou"}
              onClick={() => setTab("foryou")}
            />
          </div>
          <LangToggle compact className="pointer-events-auto md:invisible" />
        </div>
        <div className="pointer-events-auto absolute inset-x-0 top-[3.75rem] z-20 flex gap-1.5 overflow-x-auto no-scrollbar px-3 md:top-16">
          {(
            [
              ["ALL", c.filterAll],
              ["MX", c.filterMx],
              ["ES", c.filterEs],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setCountryFilter(id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium",
                countryFilter === id
                  ? "bg-primary text-primary-fg"
                  : "bg-bg/50 text-fg",
              )}
            >
              {label}
            </button>
          ))}
          {SERIES.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                setSeriesFilter(seriesFilter === id ? "ALL" : (id as SeriesId))
              }
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium",
                seriesFilter === id
                  ? "bg-primary text-primary-fg"
                  : "bg-bg/50 text-fg",
              )}
            >
              {SERIES_LABEL[id][getLocale() === "en" ? "en" : "es"]}
            </button>
          ))}
        </div>

        {clips.length === 0 ? (
          <p className="px-6 py-32 text-center text-muted">{emptyCopy}</p>
        ) : (
          <div ref={scroller} className="stage-scroller no-scrollbar">
            {clips.map((clip, i) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                index={i}
                active={i === index}
                near={Math.abs(i - index) <= 1}
              />
            ))}
          </div>
        )}
      </div>

      {current ? (
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <ActionRail
            clip={current}
            onComments={() => setDeskPanel("comments")}
            onShare={() => setDeskPanel("share")}
          />
          <StagePager
            hasPrev={index > 0}
            hasNext={index < clips.length - 1}
            onPrev={() => scrollToIndex(index - 1)}
            onNext={() => scrollToIndex(index + 1)}
          />
        </div>
      ) : null}

      {current && deskPanel === "comments" ? (
        <CommentsDock
          clip={current}
          onClose={() => setDeskPanel(null)}
          variant="dock"
        />
      ) : null}
      {current && deskPanel === "share" ? (
        <ShareDock
          clip={current}
          onClose={() => setDeskPanel(null)}
          variant="dock"
        />
      ) : null}
      {current && !deskPanel ? (
        <SuggestedAside clip={current} clips={clips} />
      ) : null}
    </div>
  );
}

function StageTab({
  label,
  active,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pointer-events-auto relative pb-2 text-sm font-medium drop-shadow-sm",
        active ? "text-primary" : "text-fg/55",
        className,
      )}
    >
      {label}
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-px bg-primary" />
      ) : null}
    </button>
  );
}

function ClipCard({
  clip,
  index,
  active,
  near,
}: {
  clip: Clip;
  index: number;
  active: boolean;
  near: boolean;
}) {
  const c = useCopy();
  const { followed, liked, toggleFollow, toggleLike, togglePaused, setPaused } = useOjea();
  const [sheet, setSheet] = useState<"comments" | "share" | null>(null);
  const [heart, setHeart] = useState(false);
  const [holding, setHolding] = useState(false);
  const [expand, setExpand] = useState(false);
  const lastTap = useRef(0);
  const holdTimer = useRef(0);
  const held = useRef(false);
  const isFollowed = !!followed[clip.user];
  const isLiked = !!liked[clip.id];
  const longCaption = clip.caption.length > 88;

  function onTap() {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      if (!isLiked) toggleLike(clip.id);
      setHeart(true);
      window.setTimeout(() => setHeart(false), 700);
    } else {
      togglePaused();
    }
    lastTap.current = now;
  }

  function clearHold() {
    window.clearTimeout(holdTimer.current);
    if (held.current) {
      held.current = false;
      setHolding(false);
      setPaused(false);
      return true;
    }
    return false;
  }

  return (
    <article data-clip-index={index} className="stage-clip">
      <ClipPlayer clip={clip} active={active} near={near} holding={holding} />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40" />
      <button
        type="button"
        className="absolute inset-0"
        aria-label={c.pauseOrLike}
        onPointerDown={() => {
          held.current = false;
          holdTimer.current = window.setTimeout(() => {
            held.current = true;
            setHolding(true);
            setPaused(true);
          }, 180);
        }}
        onPointerUp={() => {
          if (clearHold()) return;
          onTap();
        }}
        onPointerCancel={() => {
          clearHold();
        }}
        onPointerLeave={() => {
          if (held.current) clearHold();
        }}
      />

      {heart ? (
        <Heart className="heart-pop pointer-events-none absolute top-1/2 left-1/2 z-10 size-24 -translate-x-1/2 -translate-y-1/2 fill-like text-like" />
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-16 z-10 px-4 md:bottom-6 md:right-4 md:left-4">
        <div className="pointer-events-auto max-w-xs">
          {clip.live ? (
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-live/40 bg-bg/55 px-2 py-0.5 text-xs font-medium text-fg">
              <span className="live-dot size-1.5 rounded-full bg-live" />
              {c.liveNow(formatCount(clip.viewers ?? 0))}
            </p>
          ) : null}
          <p className="text-sm font-medium">
            <Link to="/u/$user" params={{ user: clip.user }} className="hover:text-primary">
              @{clip.user}
            </Link>{" "}
            <button
              type="button"
              className="text-primary"
              onClick={() => toggleFollow(clip.user)}
            >
              {isFollowed ? c.following : c.follow}
            </button>
          </p>
          <p className={cn("mt-1 whitespace-pre-line text-sm leading-snug text-fg/90", !expand && "line-clamp-2")}>
            {clip.caption}
          </p>
          {longCaption ? (
            <button
              type="button"
              className="mt-0.5 text-xs text-muted"
              onClick={() => setExpand((v) => !v)}
            >
              {expand ? c.seeLess : c.more}
            </button>
          ) : null}
          {clip.tags.length ? (
            <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-primary">
              {clip.tags.map((tag) => (
                <Link key={tag} to="/tag/$tag" params={{ tag }}>
                  #{tag}
                </Link>
              ))}
            </p>
          ) : null}
          <p className="mt-2 flex items-center gap-1 text-xs text-primary">
            <MapPin className="size-3.5" />
            {clip.city}
          </p>
          <Link
            to="/sonido/$id"
            params={{ id: clip.sound }}
            className="mt-2 flex items-center gap-2 text-xs text-fg/80"
          >
            <Music2 className="size-3.5 text-primary" />
            <span className="truncate">
              {clip.sound} · {clip.soundArtist}
            </span>
          </Link>
        </div>
      </div>

      <div className="absolute right-3 bottom-28 z-10 md:hidden">
        <ActionRail
          clip={clip}
          onComments={() => setSheet("comments")}
          onShare={() => setSheet("share")}
        />
      </div>

      {sheet === "comments" ? (
        <CommentsDock clip={clip} onClose={() => setSheet(null)} variant="sheet" />
      ) : null}
      {sheet === "share" ? (
        <ShareDock clip={clip} onClose={() => setSheet(null)} variant="sheet" />
      ) : null}
    </article>
  );
}
