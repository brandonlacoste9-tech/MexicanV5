import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Globe, Languages, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useCopy, useLocale, type Locale } from "@/lib/i18n";
import {
  getHomeCity,
  region,
  type RegionCity,
} from "@/lib/region";
import { formatGuestRemaining } from "@/lib/session";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/ajustes")({ component: Ajustes });

function Ajustes() {
  const {
    user,
    userId,
    displayName,
    guest,
    guestRemainingMs,
    logout,
    backend,
    saveProfile,
    saveHomeCity,
  } = useOjea();
  const c = useCopy();
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  const navigate = useNavigate();
  const [name, setName] = useState(displayName ?? user ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [home, setHome] = useState<RegionCity>(getHomeCity);

  const languages: Array<{ code: Locale; title: string; lead: string }> = [
    { code: "es", title: c.spanish, lead: c.spanishLead },
    { code: "en", title: c.english, lead: c.englishLead },
  ];

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <h1 className="font-display text-3xl tracking-tight">{c.settings}</h1>
      <p className="mt-2 text-sm text-muted">
        {backend === "live" ? c.settingsLeadLive : c.settingsLeadLocal}
      </p>

      <section className="mt-8 rounded-xl border border-border bg-elevated p-5">
        <p className="flex items-center gap-2 text-xs tracking-wide text-muted uppercase">
          <Languages className="size-3.5" aria-hidden />
          {c.language}
        </p>
        <div className="mt-3 grid gap-2">
          {languages.map((lang) => {
            const active = locale === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLocale(lang.code)}
                aria-pressed={active}
                className={cn(
                  "flex min-h-14 items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface hover:border-primary/40",
                )}
              >
                <Globe className="size-4 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-fg">
                    {lang.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {lang.lead}
                  </span>
                </span>
                {active ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    <Check className="size-4" aria-hidden />
                    {c.languageActive}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-elevated p-5">
        <p className="flex items-center gap-2 text-xs tracking-wide text-muted uppercase">
          <MapPin className="size-3.5" aria-hidden />
          {c.regionPack}
        </p>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl tracking-tight">
            {region.brand} · {c.legalMexico.split("·")[1]?.trim() || "México"}
          </h2>
          <span className="rounded-full border border-primary/40 px-2 py-0.5 text-[10px] tracking-wide text-primary uppercase">
            {c.packLive}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted">{c.regionLead}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs tracking-wide text-muted uppercase">
              {c.timezone}
            </dt>
            <dd className="mt-1 text-fg">{region.timezone.replace("_", " ")}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-muted uppercase">
              {c.currency}
            </dt>
            <dd className="mt-1 text-fg">{region.currency}</dd>
          </div>
        </dl>
        <p className="mt-5 text-xs tracking-wide text-muted uppercase">
          {c.homeCity}
        </p>
        <p className="mt-1 text-xs text-muted">{c.homeCityLead}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {region.cities.map((city) => {
            const active = home === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setHome(city);
                  void saveHomeCity(city);
                }}
                aria-pressed={active}
                className={cn(
                  "h-10 rounded-full border px-3 text-sm",
                  active
                    ? "border-primary bg-primary text-primary-fg"
                    : "border-border text-muted hover:text-fg",
                )}
              >
                {city}
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-xs tracking-wide text-muted uppercase">
          {c.tagsLabel}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {region.seedTags.map((tag) => (
            <Link
              key={tag}
              to="/tag/$tag"
              params={{ tag }}
              className="grid h-10 place-items-center rounded-full border border-border px-3 text-sm text-muted hover:text-fg"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-elevated p-5">
        <p className="text-xs tracking-wide text-muted uppercase">{c.session}</p>
        <p className="mt-2 font-display text-xl">
          {user ? `@${user}` : c.noAccount}
        </p>
        <p className="mt-1 text-sm text-muted">
          {userId
            ? c.realAccount
            : guest
              ? c.guestSettings(formatGuestRemaining(guestRemainingMs))
              : c.enterToSave}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {userId || guest ? (
            <Button
              variant="gold-outline"
              onClick={() => {
                logout();
                void navigate({ to: "/entrar" });
              }}
            >
              {c.signOut}
            </Button>
          ) : (
            <Link
              to="/entrar"
              className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
            >
              {c.signIn}
            </Link>
          )}
          <Link
            to="/registro"
            className="inline-flex h-11 items-center rounded-md border border-border px-4 text-sm text-primary"
          >
            {c.createAccount}
          </Link>
        </div>
      </section>

      {userId ? (
        <section className="mt-4 rounded-xl border border-border bg-elevated p-5">
          <p className="text-xs tracking-wide text-muted uppercase">{c.profile}</p>
          <form
            className="mt-3 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setPending(true);
              setError(null);
              void saveProfile(name).then((err) => {
                setPending(false);
                if (err) setError(err);
              });
            }}
          >
            <label className="block text-sm">
              <span className="mb-1 block text-muted">{c.displayName}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:outline-2 focus:outline-primary"
              />
            </label>
            {error ? <p className="text-sm text-live">{error}</p> : null}
            <Button type="submit" disabled={pending}>
              {pending ? c.saving : c.saveName}
            </Button>
          </form>
        </section>
      ) : null}

      <section className="mt-4 rounded-xl border border-border bg-elevated p-5">
        <p className="text-xs tracking-wide text-muted uppercase">{c.account}</p>
        <Link
          to="/recuperar"
          className="mt-3 block text-sm text-primary hover:underline"
        >
          {c.recoverLink}
        </Link>
        <p className="mt-3 text-sm text-muted">{c.googleHint}</p>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-elevated p-5">
        <p className="text-xs tracking-wide text-muted uppercase">{c.legal}</p>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <Link to="/terminos" className="text-primary hover:underline">
            {c.terms}
          </Link>
          <Link to="/privacidad" className="text-primary hover:underline">
            {c.privacy}
          </Link>
          <Link to="/comunidad" className="text-primary hover:underline">
            {c.community}
          </Link>
        </div>
      </section>

      <p className="mt-8 text-xs text-muted">{c.footer}</p>
    </div>
  );
}
