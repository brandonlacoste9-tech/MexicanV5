import { Link } from "@tanstack/react-router";
import {
  Ban,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Copy,
  Flag,
  Heart,
  MessageCircle,
  Music2,
  Plus,
  Repeat2,
  Send,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Clip } from "@/lib/clips";
import { clipPermalink } from "@/lib/clip-link";
import { useCopy } from "@/lib/i18n";
import { formatCount, useOjea } from "@/lib/store";
import { AvatarCircle } from "@/components/avatar";

export function clipShareUrl(clip: Clip) {
  return clipPermalink(clip.id);
}

export function ActionRail({
  clip,
  onComments,
  onShare,
}: {
  clip: Clip;
  onComments: () => void;
  onShare: () => void;
}) {
  const c = useCopy();
  const {
    liked,
    saved,
    followed,
    muted,
    paused,
    toggleLike,
    toggleSave,
    toggleFollow,
    toggleMute,
    avatars,
  } = useOjea();
  const isLiked = !!liked[clip.id];
  const isSaved = !!saved[clip.id];
  const isFollowed = !!followed[clip.user];
  const saveCount = Math.max(1, Math.round(clip.likes / 6) + (isSaved ? 1 : 0));
  const shareCount = clip.shares ?? Math.max(1, Math.round(clip.likes / 14));

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative mb-1">
        <Link
          to="/u/$user"
          params={{ user: clip.user }}
          className="rounded-full border-2 border-fg"
        >
          <AvatarCircle name={clip.displayName} src={avatars[clip.user]} size="md" className="border-0" />
        </Link>
        {!isFollowed ? (
          <button
            type="button"
            aria-label={c.follow}
            className="absolute -bottom-1 left-1/2 grid size-5 -translate-x-1/2 place-items-center rounded-full bg-primary text-primary-fg"
            onClick={() => toggleFollow(clip.user)}
          >
            <Plus className="size-3" strokeWidth={3} />
          </button>
        ) : null}
      </div>
      <RailBtn label={formatCount(clip.likes)} onClick={() => toggleLike(clip.id)}>
        <Heart className={cn("size-6", isLiked && "fill-like text-like")} />
      </RailBtn>
      <RailBtn label={String(clip.comments.length)} onClick={onComments}>
        <MessageCircle className="size-6" />
      </RailBtn>
      <RailBtn label={formatCount(saveCount)} onClick={() => toggleSave(clip.id)}>
        <Bookmark className={cn("size-6", isSaved && "fill-fg text-fg")} />
      </RailBtn>
      <RailBtn label={formatCount(shareCount)} onClick={onShare}>
        <Share2 className="size-6" />
      </RailBtn>
      <Link
        to="/sonido/$id"
        params={{ id: clip.sound }}
        className="mt-1 grid size-12 place-items-center rounded-full border border-primary/40 bg-elevated"
        aria-label={clip.sound}
      >
        <Music2
          className={cn("size-5 text-primary", !paused && !muted && "spin-disc")}
        />
      </Link>
      <RailBtn label={muted ? c.mute : c.audio} onClick={toggleMute}>
        {muted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
      </RailBtn>
    </div>
  );
}

function RailBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-xs text-fg"
    >
      <span className="grid size-11 place-items-center rounded-full bg-bg/40 md:bg-elevated">
        {children}
      </span>
      <span className="tabular-nums">{label}</span>
    </button>
  );
}

export function CommentsDock({
  clip,
  onClose,
  variant,
}: {
  clip: Clip;
  onClose: () => void;
  variant: "sheet" | "dock";
}) {
  const c = useCopy();
  const { user, openAuth, addComment } = useOjea();
  const [draft, setDraft] = useState("");

  return (
    <div
      className={
        variant === "dock"
          ? "hidden h-[min(92dvh,820px)] w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-surface md:flex lg:w-80"
          : "absolute inset-x-0 bottom-0 z-30 max-h-[46%] overflow-auto rounded-t-lg border-t border-border bg-bg/95 p-4"
      }
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className={cn(
          "flex items-center justify-between",
          variant === "dock" && "border-b border-border px-4 py-3",
        )}
      >
        <h3 className="font-display text-lg">
          {variant === "dock" ? c.commentsCount(clip.comments.length) : c.comments}
        </h3>
        <button type="button" className="text-sm text-muted" onClick={onClose}>
          {c.close}
        </button>
      </div>
      <ul
        className={cn(
          "space-y-3 text-sm",
          variant === "dock" ? "min-h-0 flex-1 overflow-auto px-4 py-3" : "mt-2",
        )}
      >
        {clip.comments.map((comment, i) => (
          <li key={i}>
            <span className="text-primary">@{comment.user}</span>{" "}
            <span className="text-fg/90">{comment.text}</span>
          </li>
        ))}
      </ul>
      <form
        className={cn(variant === "dock" && "border-t border-border p-3")}
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          if (!user) {
            openAuth();
            return;
          }
          addComment(clip.id, draft.trim());
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={user ? c.commentPh : c.commentNeedLogin}
          className={cn(
            "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:outline-2 focus:outline-primary",
            variant === "sheet" && "mt-3 bg-surface",
          )}
        />
      </form>
    </div>
  );
}

export function ShareDock({
  clip,
  onClose,
  variant,
}: {
  clip: Clip;
  onClose: () => void;
  variant: "sheet" | "dock";
}) {
  const c = useCopy();
  const { user, openAuth, showToast, hideClip, toggleRepost, bumpShares } = useOjea();

  function wrap(fn: () => void) {
    return () => {
      fn();
      onClose();
    };
  }

  return (
    <div
      className={
        variant === "dock"
          ? "hidden h-[min(92dvh,820px)] w-72 shrink-0 flex-col overflow-auto rounded-xl border border-border bg-surface p-4 md:flex lg:w-80"
          : "absolute inset-x-0 bottom-0 z-30 overflow-auto rounded-t-lg border-t border-border bg-bg/95 p-4"
      }
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg">{c.shareSheet}</h3>
        <button type="button" className="text-sm text-muted" onClick={onClose}>
          {c.close}
        </button>
      </div>
      <div className="grid gap-1">
        <SheetRow
          icon={<Copy className="size-4" />}
          label={c.copyLink}
          onClick={wrap(() => {
            void navigator.clipboard?.writeText(clipShareUrl(clip));
            bumpShares(clip.id);
            showToast(c.linkCopied);
          })}
        />
        <SheetRow
          icon={<Send className="size-4" />}
          label={c.sendWhatsApp}
          onClick={wrap(() => {
            bumpShares(clip.id);
            window.open(
              `https://wa.me/?text=${encodeURIComponent(`${clip.caption} ${clipShareUrl(clip)}`)}`,
              "_blank",
              "noopener,noreferrer",
            );
          })}
        />
        <SheetRow
          icon={<MessageCircle className="size-4" />}
          label={c.sendOtealo}
          onClick={wrap(() => {
            if (!user) {
              openAuth();
              return;
            }
            bumpShares(clip.id);
            window.location.assign(`/inbox?to=${encodeURIComponent(clip.user)}`);
          })}
        />
        <SheetRow
          icon={<Repeat2 className="size-4" />}
          label={c.repost}
          onClick={wrap(() => toggleRepost(clip.id))}
        />
        <SheetRow
          icon={<Ban className="size-4" />}
          label={c.notInterested}
          onClick={wrap(() => hideClip(clip.id))}
        />
        <SheetRow
          icon={<Flag className="size-4" />}
          label={c.report}
          onClick={wrap(() => showToast(c.reportedOk))}
        />
      </div>
    </div>
  );
}

function SheetRow({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 items-center gap-3 rounded-md px-2 text-left text-sm hover:bg-elevated"
    >
      <span className="grid size-9 place-items-center rounded-full bg-elevated text-fg">
        {icon}
      </span>
      {label}
    </button>
  );
}

export function StagePager({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const c = useCopy();
  return (
    <div className="hidden flex-col gap-3 md:flex">
      <button
        type="button"
        aria-label={c.prevClip}
        disabled={!hasPrev}
        onClick={onPrev}
        className="grid size-11 place-items-center rounded-full border border-border bg-elevated text-fg disabled:opacity-30"
      >
        <ChevronUp className="size-5" />
      </button>
      <button
        type="button"
        aria-label={c.nextClip}
        disabled={!hasNext}
        onClick={onNext}
        className="grid size-11 place-items-center rounded-full border border-border bg-elevated text-fg disabled:opacity-30"
      >
        <ChevronDown className="size-5" />
      </button>
    </div>
  );
}

export function SuggestedAside({ clip, clips }: { clip: Clip; clips: Clip[] }) {
  const c = useCopy();
  const { followed, toggleFollow, avatars } = useOjea();
  const seen = new Set<string>([clip.user]);
  const suggested: Clip[] = [];
  for (const item of clips) {
    if (seen.has(item.user) || followed[item.user]) continue;
    seen.add(item.user);
    suggested.push(item);
    if (suggested.length >= 4) break;
  }
  const isFollowed = !!followed[clip.user];

  return (
    <aside className="hidden w-72 shrink-0 flex-col justify-center lg:flex">
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center gap-3">
          <Link
            to="/u/$user"
            params={{ user: clip.user }}
            className="rounded-full"
          >
            <AvatarCircle name={clip.displayName} src={avatars[clip.user]} size="md" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              to="/u/$user"
              params={{ user: clip.user }}
              className="block truncate font-medium hover:text-primary"
            >
              @{clip.user}
            </Link>
            <p className="truncate text-xs text-muted">{clip.displayName}</p>
          </div>
        </div>
        <p className="mt-3 line-clamp-3 text-sm text-fg/80">{clip.caption}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => toggleFollow(clip.user)}
            className={cn(
              "h-10 flex-1 rounded-md text-sm font-medium",
              isFollowed
                ? "border border-border text-fg"
                : "bg-primary text-primary-fg",
            )}
          >
            {isFollowed ? c.following : c.follow}
          </button>
          <Link
            to="/inbox"
            search={{ to: clip.user }}
            className="grid h-10 flex-1 place-items-center rounded-md border border-border text-sm"
          >
            {c.messageCreator}
          </Link>
        </div>
      </div>
      {suggested.length ? (
        <>
          <p className="mt-6 text-xs tracking-widest text-muted uppercase">
            {c.suggested}
          </p>
          <ul className="mt-3 space-y-3">
            {suggested.map((item) => (
              <li key={item.user} className="flex items-center gap-3">
                <Link
                  to="/u/$user"
                  params={{ user: item.user }}
                  className="shrink-0 rounded-full"
                >
                  <AvatarCircle name={item.displayName} src={avatars[item.user]} size="sm" />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">@{item.user}</p>
                  <p className="truncate text-xs text-muted">{item.city}</p>
                </div>
                <button
                  type="button"
                  className="h-8 rounded-md bg-primary px-3 text-xs font-medium text-primary-fg"
                  onClick={() => toggleFollow(item.user)}
                >
                  {c.follow}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </aside>
  );
}
