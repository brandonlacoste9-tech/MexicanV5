import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipStage } from "@/components/clip-stage";
import { Button } from "@/components/ui/button";
import type { Clip } from "@/lib/clips";
import { useCopy } from "@/lib/i18n";
import { fetchClipById } from "@/lib/ojea-api";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/c/$id")({
  component: ClipPermalink,
});

function ClipPermalink() {
  const { id } = Route.useParams();
  const { clips, hidden, setIndex, setTab } = useOjea();
  const c = useCopy();
  const [extra, setExtra] = useState<Clip | null>(null);
  const [lookup, setLookup] = useState<"idle" | "miss">("idle");

  const clip = clips.find((item) => item.id === id) ?? extra;

  useEffect(() => {
    setTab("foryou");
    setIndex(0);
  }, [id, setIndex, setTab]);

  useEffect(() => {
    if (clips.some((item) => item.id === id)) {
      setExtra(null);
      setLookup("idle");
      return;
    }
    let alive = true;
    void fetchClipById(id).then((row) => {
      if (!alive) return;
      if (row) {
        setExtra(row);
        setLookup("idle");
      } else {
        setLookup("miss");
      }
    });
    return () => {
      alive = false;
    };
  }, [id, clips]);

  if (!clip && lookup === "miss") {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <h1 className="font-display text-3xl tracking-tight">{c.clipGone}</h1>
        <p className="mt-2 text-sm text-muted">{c.clipGoneLead}</p>
        <Link to="/" className="mt-6 inline-flex">
          <Button>{c.navForYou}</Button>
        </Link>
      </div>
    );
  }

  if (!clip) {
    return <div className="grid min-h-dvh place-items-center text-sm text-muted">{c.loadingClip}</div>;
  }

  const rest = clips.filter((item) => item.id !== id && !hidden[item.id]);
  return <ClipStage clips={[clip, ...rest]} />;
}
