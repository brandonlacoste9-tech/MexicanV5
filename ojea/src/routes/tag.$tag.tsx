import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipGrid } from "@/components/clip-grid";
import { useCopy } from "@/lib/i18n";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/tag/$tag")({ component: TagPage });

function TagPage() {
  const { tag } = Route.useParams();
  const clips = useOjea((s) => s.clips);
  const c = useCopy();
  const list = clips.filter((clip) =>
    clip.tags.some((item) => item.toLowerCase() === tag.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">{c.tagLabel}</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight">#{tag}</h1>
      <p className="mt-2 text-sm text-muted">{c.clipsInMx(list.length)}</p>
      <div className="mt-6">
        <ClipGrid clips={list} />
      </div>
      <p className="mt-8 text-sm">
        <Link to="/explorar" className="text-primary hover:underline">
          {c.moreExplore}
        </Link>
      </p>
    </div>
  );
}
