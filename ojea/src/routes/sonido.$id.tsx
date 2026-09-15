import { createFileRoute } from "@tanstack/react-router";
import { ClipGrid } from "@/components/clip-grid";
import { useCopy } from "@/lib/i18n";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/sonido/$id")({ component: Sonido });

function Sonido() {
  const { id } = Route.useParams();
  const { clips } = useOjea();
  const c = useCopy();
  const list = clips.filter((clip) => clip.sound === id);
  const artist = list[0]?.soundArtist;

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <p className="text-xs tracking-widest text-muted uppercase">{c.originalSound}</p>
      <h1 className="mt-1 font-display text-3xl tracking-tight">{id}</h1>
      {artist ? <p className="mt-2 text-sm text-muted">{artist}</p> : null}
      <div className="mt-8">
        <ClipGrid clips={list} />
      </div>
    </div>
  );
}
