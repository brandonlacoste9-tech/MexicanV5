import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Hash, Music2, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { ClipGrid } from "@/components/clip-grid";
import { cn } from "@/lib/cn";
import { useCopy, useLocale } from "@/lib/i18n";
import { region } from "@/lib/region";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/buscar")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: Buscar,
});

type SearchTab = "top" | "videos" | "users" | "sounds" | "tags";

function Buscar() {
  const { q: qParam } = Route.useSearch();
  const { clips, setIndex, setTab } = useOjea();
  const navigate = useNavigate();
  const c = useCopy();
  const locale = useLocale((s) => s.locale);
  const [q, setQ] = useState(qParam ?? "");
  const [pane, setPane] = useState<SearchTab>("top");
  const query = q.trim().toLowerCase();

  const users = useMemo(() => {
    const map = new Map<string, { user: string; displayName: string; city: string }>();
    for (const clip of clips) {
      if (!map.has(clip.user)) {
        map.set(clip.user, {
          user: clip.user,
          displayName: clip.displayName,
          city: clip.city,
        });
      }
    }
    return [...map.values()];
  }, [clips]);

  const sounds = useMemo(() => {
    const map = new Map<string, { sound: string; artist: string; count: number }>();
    for (const clip of clips) {
      const prev = map.get(clip.sound);
      map.set(clip.sound, {
        sound: clip.sound,
        artist: clip.soundArtist,
        count: (prev?.count ?? 0) + 1,
      });
    }
    return [...map.values()];
  }, [clips]);

  const tags = useMemo(() => {
    const map = new Map<string, number>();
    for (const clip of clips) {
      for (const tag of clip.tags) {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      }
    }
    return [...map.entries()].map(([tag, count]) => ({ tag, count }));
  }, [clips]);

  const videoHits = useMemo(() => {
    if (!query) return clips;
    return clips.filter((clip) =>
      `${clip.caption} ${clip.user} ${clip.city} ${clip.tags.join(" ")} ${clip.sound}`
        .toLowerCase()
        .includes(query),
    );
  }, [clips, query]);

  const userHits = useMemo(() => {
    if (!query) return users;
    return users.filter((u) =>
      `${u.user} ${u.displayName} ${u.city}`.toLowerCase().includes(query),
    );
  }, [users, query]);

  const soundHits = useMemo(() => {
    if (!query) return sounds;
    return sounds.filter((s) =>
      `${s.sound} ${s.artist}`.toLowerCase().includes(query),
    );
  }, [sounds, query]);

  const tagHits = useMemo(() => {
    if (!query) return tags;
    return tags.filter((t) => t.tag.toLowerCase().includes(query));
  }, [tags, query]);

  const tabs: { id: SearchTab; label: string }[] = [
    { id: "top", label: c.searchTop },
    { id: "videos", label: c.searchVideos },
    { id: "users", label: c.searchUsers },
    { id: "sounds", label: c.searchSounds },
    { id: "tags", label: c.searchTags },
  ];

  const empty = query
    ? videoHits.length + userHits.length + soundHits.length + tagHits.length === 0
    : false;

  return (
    <div className="px-5 py-8 md:px-10">
      <h1 className="font-display text-3xl tracking-tight">{c.searchTitle}</h1>
      <label className="relative mt-6 block">
        <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={c.searchPh}
          autoFocus
          className="h-11 w-full rounded-md border border-border bg-surface pr-3 pl-10 text-sm outline-none focus:outline-2 focus:outline-primary"
        />
      </label>

      {!query ? (
        <div className="mt-8">
          <p className="text-xs tracking-widest text-muted uppercase">{c.trending}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {region.trending.map((item) => (
              <button
                key={item.q}
                type="button"
                onClick={() => setQ(item.q)}
                className="h-10 rounded-full border border-border px-4 text-sm text-muted hover:text-fg"
              >
                {locale === "en" ? item.en : item.es}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto border-b border-border">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPane(item.id)}
            className={cn(
              "shrink-0 pb-2 text-sm",
              pane === item.id ? "border-b border-primary text-primary" : "text-muted",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {query && empty ? <p className="mt-8 text-sm text-muted">{c.noResults}</p> : null}

      {query && (pane === "top" || pane === "videos") ? (
        <div className="mt-6">
          <ClipGrid clips={videoHits} />
        </div>
      ) : null}

      {query && (pane === "top" || pane === "users") ? (
        <ul className={cn("mt-6 space-y-2", pane === "top" && videoHits.length ? "mt-8" : "")}>
          {userHits.slice(0, pane === "top" ? 4 : undefined).map((item) => (
            <li key={item.user}>
              <Link
                to="/u/$user"
                params={{ user: item.user }}
                className="flex h-14 items-center gap-3 rounded-md px-2 hover:bg-elevated"
              >
                <span className="grid size-10 place-items-center rounded-full bg-elevated text-xs text-primary">
                  <UserRound className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm">@{item.user}</span>
                  <span className="block truncate text-xs text-muted">
                    {item.displayName} · {item.city}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {query && (pane === "top" || pane === "sounds") ? (
        <ul className="mt-4 space-y-2">
          {soundHits.slice(0, pane === "top" ? 3 : undefined).map((item) => (
            <li key={item.sound}>
              <button
                type="button"
                className="flex h-14 w-full items-center gap-3 rounded-md px-2 text-left hover:bg-elevated"
                onClick={() => {
                  void navigate({ to: "/sonido/$id", params: { id: item.sound } });
                }}
              >
                <span className="grid size-10 place-items-center rounded-full border border-primary/30 bg-elevated text-primary">
                  <Music2 className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm">{item.sound}</span>
                  <span className="block truncate text-xs text-muted">
                    {item.artist} · {item.count}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {query && (pane === "top" || pane === "tags") ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tagHits.slice(0, pane === "top" ? 8 : undefined).map((item) => (
            <li key={item.tag}>
              <Link
                to="/tag/$tag"
                params={{ tag: item.tag }}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-muted hover:text-fg"
              >
                <Hash className="size-3.5" />
                {item.tag}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {query && pane === "top" && videoHits[0] ? (
        <button
          type="button"
          className="mt-8 text-sm text-primary"
          onClick={() => {
            const idx = clips.findIndex((clip) => clip.id === videoHits[0].id);
            setTab("foryou");
            setIndex(idx >= 0 ? idx : 0);
            void navigate({ to: "/" });
          }}
        >
          {c.seeInFeed}
        </button>
      ) : null}
    </div>
  );
}
