import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ClipGrid } from "@/components/clip-grid";
import { EXPLORE_TAGS, STORIES } from "@/lib/clips";
import { useCopy, useLocale } from "@/lib/i18n";
import { region } from "@/lib/region";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/explorar")({ component: Explorar });

function Explorar() {
  const { clips, setIndex, setTab } = useOjea();
  const navigate = useNavigate();
  const c = useCopy();
  const locale = useLocale((s) => s.locale);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof region.exploreCategories)[number]["id"]>("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const category = region.exploreCategories.find((item) => item.id === cat);
    return clips.filter((clip) => {
      const hay = `${clip.caption} ${clip.user} ${clip.city} ${clip.tags.join(" ")} ${clip.sound}`.toLowerCase();
      if (query && !hay.includes(query)) return false;
      if (!category || category.id === "all") return true;
      return category.match.some((token) => hay.includes(token));
    });
  }, [clips, q, cat]);

  return (
    <div className="px-5 py-8 md:px-10">
      <h1 className="font-display text-3xl tracking-tight">{c.exploreTitle}</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">{c.exploreLead}</p>

      <label className="relative mt-6 block">
        <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={c.searchPh}
          className="h-11 w-full rounded-md border border-border bg-surface pr-3 pl-10 text-sm outline-none focus:outline-2 focus:outline-primary"
        />
      </label>

      <div className="mt-5">
        <p className="text-xs tracking-widest text-muted uppercase">{c.trending}</p>
        <div className="mt-2 flex flex-wrap gap-2">
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

      <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-2">
        {STORIES.map((s) => (
          <button
            key={s.user}
            type="button"
            className="flex w-16 shrink-0 flex-col items-center gap-1"
            onClick={() => {
              const idx = clips.findIndex((clip) => clip.user === s.user);
              if (idx >= 0) {
                setTab("foryou");
                setIndex(idx);
                void navigate({ to: "/" });
              }
            }}
          >
            <span className="rounded-full border-2 border-primary p-0.5">
              <img
                src={s.image}
                alt=""
                className="size-14 rounded-full object-cover"
              />
            </span>
            <span className="w-full truncate text-center text-xs text-muted">
              {s.user.split(".")[0]}
            </span>
          </button>
        ))}
      </div>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
        {region.exploreCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCat(item.id)}
            className={`h-10 shrink-0 rounded-full border px-4 text-sm ${
              cat === item.id
                ? "border-primary bg-elevated text-primary"
                : "border-border text-muted hover:text-fg"
            }`}
          >
            {locale === "en" ? item.en : item.es}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {EXPLORE_TAGS.map((tag) => (
          <Link
            key={tag}
            to="/tag/$tag"
            params={{ tag }}
            className="grid h-10 place-items-center rounded-full border border-border px-4 text-sm text-muted hover:text-fg"
          >
            {tag}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ClipGrid clips={filtered} />
      </div>

      <p className="mt-8 text-xs text-muted">
        {c.tryInbox}{" "}
        <Link to="/inbox" className="text-primary">
          {c.theInbox}
        </Link>{" "}
        {c.orUpload}
      </p>
    </div>
  );
}
