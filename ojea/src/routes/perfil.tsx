import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { ClipGrid } from "@/components/clip-grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useCopy } from "@/lib/i18n";
import { getHomeCity } from "@/lib/region";
import { formatGuestRemaining } from "@/lib/session";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/perfil")({ component: Perfil });

function Perfil() {
  const {
    user,
    userId,
    displayName,
    city,
    bio,
    guest,
    guestRemainingMs,
    clips,
    saved,
    liked,
    openAuth,
    logout,
    followed,
    backend,
    reposted,
  } = useOjea();
  const c = useCopy();
  const [pane, setPane] = useState<"clips" | "liked" | "saved" | "reposts">("clips");
  const mine = user && userId ? clips.filter((clip) => clip.user === user) : [];
  const likedClips = clips.filter((clip) => liked[clip.id]);
  const savedClips = clips.filter((clip) => saved[clip.id]);
  const repostClips = clips.filter((clip) => reposted[clip.id]);
  const followingCount = Object.values(followed).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">
            {user ? `@${user}` : c.profile}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {displayName && displayName !== user ? displayName : null}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="size-3.5 text-primary" aria-hidden />
            {city || getHomeCity()} · {c.hiveMexico}
          </p>
          {bio ? <p className="mt-3 max-w-sm text-sm text-fg/90">{bio}</p> : null}
        </div>
        <Link to="/ajustes" className="text-xs text-primary hover:underline">
          {c.settings}
        </Link>
      </div>
      <p className="mt-3 text-sm text-muted">
        {userId
          ? backend === "live"
            ? c.profileLive
            : c.profileLocal
          : guest
            ? c.profileGuest(formatGuestRemaining(guestRemainingMs))
            : c.profileAnon}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {userId || guest ? (
          <Button variant="gold-outline" onClick={logout}>
            {c.signOut}
          </Button>
        ) : (
          <Button onClick={openAuth}>{c.signIn}</Button>
        )}
        {guest || !userId ? (
          <Link
            to="/registro"
            className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
          >
            {c.createAccount}
          </Link>
        ) : null}
      </div>
      <dl className="mt-8 grid grid-cols-3 gap-3 text-center">
        <Stat n={userId ? mine.length : clips.length} label={c.clips} />
        <Stat n={followingCount} label={c.followingTab} />
        <Stat n={savedClips.length} label={c.saved} />
      </dl>
      <div className="mt-8 flex gap-4 border-b border-border">
        {(
          [
            ["clips", c.clips],
            ["liked", c.likes],
            ["saved", c.saved],
            ["reposts", c.reposts],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPane(id)}
            className={cn(
              "pb-2 text-sm",
              pane === id ? "border-b border-primary text-primary" : "text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <ClipGrid
          clips={
            pane === "clips"
              ? userId
                ? mine
                : clips
              : pane === "liked"
                ? likedClips
                : pane === "saved"
                  ? savedClips
                  : repostClips
          }
        />
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-elevated px-2 py-4">
      <p className="font-display text-2xl tabular-nums">{n}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
