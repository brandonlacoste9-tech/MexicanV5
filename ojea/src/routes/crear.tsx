import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CITIES, SEED_CLIPS } from "@/lib/clips";
import { SERIES, SERIES_LABEL } from "@/lib/culture";
import { getLocale, useCopy } from "@/lib/i18n";
import { getHomeCity } from "@/lib/region";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/crear")({ component: Crear });

const STREET = [
  {
    label: "El puesto",
    caption: "Pastor a las 2am. Si no hay piña, no es pastor.",
    sound: "Trompo mix",
  },
  {
    label: "El organillo",
    caption: "El organillero en la esquina. La ciudad respira con él.",
    sound: "Campanas de noche",
  },
  {
    label: "El estadio",
    caption: "Cuando canta el estadio, se oye hasta la casa.",
    sound: "Luces del estadio",
  },
  {
    label: "El atardecer",
    caption: "Esta luz no se queda. 15 segundos y ya se fue.",
    sound: "Atardecer malecón",
  },
  {
    label: "La calle",
    caption: "Así está la calle hoy. ¿Y allá cómo está?",
    sound: "Calle viva",
  },
] as const;

const SOUNDS = [
  ...new Set([
    ...STREET.map((item) => item.sound),
    ...SEED_CLIPS.map((clip) => clip.sound),
  ]),
];

function Crear() {
  const { user, userId, guest, publish, submitIdea, openAuth, backend } = useOjea();
  const navigate = useNavigate();
  const c = useCopy();
  const [caption, setCaption] = useState("");
  const [city, setCity] = useState<string>(() => getHomeCity());
  const [sound, setSound] = useState<string>(STREET[4]?.sound ?? "Calle viva");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaSeries, setIdeaSeries] = useState<(typeof SERIES)[number]>("MexicoIn30s");
  const [ideaCountry, setIdeaCountry] = useState("MX");
  const [ideaScript, setIdeaScript] = useState("");
  const [ideaNotes, setIdeaNotes] = useState("");
  const [ideaPending, setIdeaPending] = useState(false);
  const [ideaError, setIdeaError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <h1 className="font-display text-3xl tracking-tight">{c.createTitle}</h1>
      <p className="mt-2 text-sm text-muted">
        {backend === "live" ? c.createLive : c.createOffline}
        {guest ? c.createGuest : null}
      </p>
      <p className="mt-6 text-xs tracking-widest text-muted uppercase">{c.templatesLabel}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {STREET.map((item) => (
          <button
            key={item.label}
            type="button"
            className="h-10 rounded-full border border-border px-3 text-sm text-muted hover:border-primary hover:text-primary"
            onClick={() => {
              setCaption(item.caption);
              setSound(item.sound);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
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
          className="mt-4 max-h-72 w-full rounded-lg object-contain bg-bg"
          muted
          loop
          autoPlay
          playsInline
        />
      ) : preview ? (
        <img
          src={preview}
          alt={c.previewAlt}
          className="mt-4 max-h-72 w-full rounded-lg object-contain bg-bg"
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
      {!userId ? (
        <Button
          className="mt-6 w-full"
          size="lg"
          onClick={() => {
            void navigate({ to: "/entrar", search: { from: "/crear" } });
          }}
        >
          {c.publishNeedLogin}
        </Button>
      ) : (
      <Button
        className="mt-6 w-full"
        size="lg"
        disabled={pending}
        onClick={() => {
          if (!user) {
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
              tags: [city.split(/\s+/)[0]!.toLowerCase(), "calle"],
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
        {pending ? c.publishing : c.publish}
      </Button>
      )}

      <h2 className="mt-12 font-display text-2xl tracking-tight">{c.ideaTitle}</h2>
      <p className="mt-2 text-sm text-muted">{c.ideaLead}</p>
      <label className="mt-4 block text-xs text-muted">{c.ideaName}</label>
      <input
        value={ideaTitle}
        onChange={(e) => setIdeaTitle(e.target.value)}
        className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:outline-2 focus:outline-primary"
      />
      <label className="mt-4 block text-xs text-muted">{c.ideaSeries}</label>
      <select
        value={ideaSeries}
        onChange={(e) => setIdeaSeries(e.target.value as (typeof SERIES)[number])}
        className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:outline-2 focus:outline-primary"
      >
        {SERIES.map((id) => (
          <option key={id} value={id}>
            {SERIES_LABEL[id][getLocale() === "en" ? "en" : "es"]}
          </option>
        ))}
      </select>
      <label className="mt-4 block text-xs text-muted">{c.ideaCountry}</label>
      <select
        value={ideaCountry}
        onChange={(e) => setIdeaCountry(e.target.value)}
        className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:outline-2 focus:outline-primary"
      >
        <option value="MX">{c.filterMx}</option>
        <option value="ES">{c.filterEs}</option>
        <option value="BOTH">{c.filterAll}</option>
      </select>
      <label className="mt-4 block text-xs text-muted">{c.ideaScript}</label>
      <textarea
        value={ideaScript}
        onChange={(e) => setIdeaScript(e.target.value)}
        rows={4}
        className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:outline-2 focus:outline-primary"
      />
      <label className="mt-4 block text-xs text-muted">{c.ideaNotes}</label>
      <textarea
        value={ideaNotes}
        onChange={(e) => setIdeaNotes(e.target.value)}
        rows={2}
        className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:outline-2 focus:outline-primary"
      />
      {ideaError ? <p className="mt-2 text-sm text-live">{ideaError}</p> : null}
      <Button
        className="mt-4 mb-8 w-full"
        variant="gold-outline"
        disabled={ideaPending}
        onClick={() => {
          if (!userId) {
            openAuth();
            return;
          }
          setIdeaPending(true);
          setIdeaError(null);
          void submitIdea({
            title: ideaTitle,
            series: ideaSeries,
            country: ideaCountry,
            scriptOutline: ideaScript,
            notes: ideaNotes,
          }).then((err) => {
            setIdeaPending(false);
            if (err) setIdeaError(err);
            else {
              setIdeaTitle("");
              setIdeaScript("");
              setIdeaNotes("");
            }
          });
        }}
      >
        {c.ideaSend}
      </Button>
    </div>
  );
}
