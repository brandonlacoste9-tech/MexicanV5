import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CITIES, SEED_CLIPS } from "@/lib/clips";
import { useCopy } from "@/lib/i18n";
import { getHomeCity } from "@/lib/region";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/crear")({ component: Crear });

const SOUNDS = [...new Set(SEED_CLIPS.map((clip) => clip.sound))];

function Crear() {
  const { user, userId, guest, publish, openAuth, backend } = useOjea();
  const navigate = useNavigate();
  const c = useCopy();
  const [caption, setCaption] = useState("");
  const [city, setCity] = useState<string>(() => getHomeCity());
  const [sound, setSound] = useState(SOUNDS[0] ?? "Sonido Ojea");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <h1 className="font-display text-3xl tracking-tight">{c.createTitle}</h1>
      <p className="mt-2 text-sm text-muted">
        {backend === "live" ? c.createLive : c.createOffline}
        {guest ? c.createGuest : null}
      </p>
      <label className="mt-6 block text-xs text-muted">{c.file}</label>
      <input
        type="file"
        accept="image/*,video/*"
        className="mt-1 block w-full text-sm file:mr-3 file:h-11 file:rounded-md file:border-0 file:bg-primary file:px-4 file:text-primary-fg"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setFile(f);
          setPreview(URL.createObjectURL(f));
        }}
      />
      {preview && file?.type.startsWith("video/") ? (
        <video
          src={preview}
          className="mt-4 max-h-72 w-full rounded-lg object-cover"
          muted
          loop
          autoPlay
          playsInline
        />
      ) : preview ? (
        <img
          src={preview}
          alt={c.previewAlt}
          className="mt-4 max-h-72 w-full rounded-lg object-cover"
        />
      ) : null}
      <label className="mt-4 block text-xs text-muted">{c.caption}</label>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:outline-2 focus:outline-primary"
        placeholder={c.captionPh}
      />
      <label className="mt-4 block text-xs text-muted">{c.city}</label>
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:outline-2 focus:outline-primary"
      >
        {CITIES.map((cityName) => (
          <option key={cityName}>{cityName}</option>
        ))}
      </select>
      <label className="mt-4 block text-xs text-muted">{c.sound}</label>
      <select
        value={sound}
        onChange={(e) => setSound(e.target.value)}
        className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:outline-2 focus:outline-primary"
      >
        {SOUNDS.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      {error ? <p className="mt-3 text-sm text-live">{error}</p> : null}
      <Button
        className="mt-6 w-full"
        size="lg"
        disabled={pending}
        onClick={() => {
          if (!userId || !user) {
            openAuth();
            return;
          }
          const artist =
            SEED_CLIPS.find((clip) => clip.sound === sound)?.soundArtist ?? user;
          setPending(true);
          setError(null);
          const isVid = Boolean(file?.type.startsWith("video/"));
          void publish(
            {
              id: crypto.randomUUID(),
              user,
              displayName: user,
              caption: caption.trim() || c.defaultCaption,
              city,
              image: isVid ? "/clips/trompo.jpg" : (preview ?? "/clips/trompo.jpg"),
              video: isVid ? preview ?? undefined : undefined,
              likes: 0,
              comments: [],
              tags: ["parati"],
              sound,
              soundArtist: artist,
            },
            file,
          )
            .then(() => {
              setPending(false);
              void navigate({ to: "/" });
            })
            .catch(() => {
              setPending(false);
              setError(c.errPublishMx);
            });
        }}
      >
        {userId
          ? pending
            ? c.publishing
            : c.publish
          : c.publishNeedLogin}
      </Button>
    </div>
  );
}
