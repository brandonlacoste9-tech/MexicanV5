import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Compass,
  Home,
  PlusSquare,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { hydrateLocale, useCopy } from "@/lib/i18n";
import { AGE_KEY, AUTH_PATHS, ONBOARD_KEY, formatGuestRemaining } from "@/lib/session";
import { useOjea, type Tab } from "@/lib/store";
import { AvatarCircle } from "@/components/avatar";
import { region } from "@/lib/region";
import { isFeedPath } from "@/lib/clip-link";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const c = useCopy();
  const {
    user,
    guest,
    guestRemainingMs,
    logout,
    authOpen,
    closeAuth,
    toast,
    notes,
    hydrate,
    boot,
    backend,
    tab,
    setTab,
    followed,
    toggleFollow,
    clips,
    avatars,
  } = useOjea();
  const unread = notes.filter((n) => n.unread).length;
  const hideChrome = AUTH_PATHS.has(pathname);

  type SideItem = {
    to: "/" | "/explorar" | "/crear" | "/inbox" | "/perfil";
    label: string;
    icon: typeof Home;
    plus?: boolean;
    tab?: Tab;
  };

  const sideNav: SideItem[] = [
    { to: "/", tab: "foryou", label: c.navForYou, icon: Home },
    { to: "/explorar", label: c.navExplore, icon: Compass },
    { to: "/", tab: "following", label: c.followingTab, icon: Users },
    { to: "/crear", label: c.navUpload, icon: PlusSquare, plus: true },
    { to: "/inbox", label: c.navInbox, icon: Bell },
    { to: "/perfil", label: c.navProfile, icon: UserRound },
  ];

  const mobileNav: SideItem[] = [
    { to: "/", tab: "foryou", label: c.navForYou, icon: Home },
    { to: "/explorar", label: c.navExplore, icon: Compass },
    { to: "/crear", label: c.navCreate, icon: PlusSquare, plus: true },
    { to: "/inbox", label: c.navInbox, icon: Bell },
    { to: "/perfil", label: c.navProfile, icon: UserRound },
  ];

  function navActive(item: SideItem) {
    if (item.tab) return isFeedPath(pathname) && tab === item.tab;
    return pathname === item.to;
  }

  const suggested = (() => {
    const seen = new Set<string>();
    const out: { user: string; displayName: string }[] = [];
    for (const clip of clips) {
      if (followed[clip.user] || seen.has(clip.user) || clip.user === user) continue;
      seen.add(clip.user);
      out.push({ user: clip.user, displayName: clip.displayName });
      if (out.length >= 3) break;
    }
    return out;
  })();

  useEffect(() => {
    const timer = window.setTimeout(() => hydrateLocale(), 50);
    try {
      const raw = localStorage.getItem("ojea-v1");
      if (raw) {
        const p = JSON.parse(raw) as {
          liked?: Record<string, boolean>;
          saved?: Record<string, boolean>;
          followed?: Record<string, boolean>;
          hidden?: Record<string, boolean>;
          reposted?: Record<string, boolean>;
        };
        hydrate({
          liked: p.liked ?? {},
          saved: p.saved ?? {},
          followed: { ...useOjea.getState().followed, ...p.followed },
          hidden: p.hidden ?? {},
          reposted: p.reposted ?? {},
        });
      }
    } catch {
      /* ignore */
    }
    void boot();
    const unsub = useOjea.subscribe((s) => {
      localStorage.setItem(
        "ojea-v1",
        JSON.stringify({
          liked: s.liked,
          saved: s.saved,
          followed: s.followed,
          hidden: s.hidden,
          reposted: s.reposted,
        }),
      );
    });
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, [hydrate, boot]);

  useEffect(() => {
    if (!authOpen) return;
    closeAuth();
    if (AUTH_PATHS.has(pathname)) return;
    void navigate({
      to: "/entrar",
      search: { from: pathname },
    });
  }, [authOpen, closeAuth, navigate, pathname]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <AgeGate />
      {hideChrome ? (
        children
      ) : (
        <>
          <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col overflow-y-auto border-r border-border bg-surface px-4 py-6 no-scrollbar md:flex">
            <Link to="/" onClick={() => setTab("foryou")} className="mb-4 px-2">
              <p className="font-display text-2xl font-semibold tracking-[0.18em] text-primary">
                {region.brand.toUpperCase()}
              </p>
              <p className="mt-1 text-xs tracking-[0.16em] text-muted uppercase">
                {c.tagline}
              </p>
            </Link>
            <LangToggle className="mb-4 self-start" />
            <Link
              to="/buscar"
              className="mb-4 flex h-10 items-center gap-2 rounded-md border border-border bg-bg px-3 text-sm text-muted hover:text-fg"
            >
              <Search className="size-4 shrink-0" />
              <span className="truncate">{c.searchPh}</span>
            </Link>
            <nav className="flex flex-1 flex-col gap-1">
              {sideNav.map((item) => {
                const Icon = item.icon;
                const active = navActive(item);
                return (
                  <Link
                    key={`${item.to}-${item.tab ?? item.label}`}
                    to={item.to}
                    onClick={() => {
                      if (item.tab) setTab(item.tab);
                    }}
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                      active
                        ? "bg-elevated text-primary"
                        : "text-fg/80 hover:bg-elevated hover:text-fg",
                    )}
                  >
                    <span className="relative">
                      <Icon className="size-4" strokeWidth={1.75} />
                      {item.to === "/inbox" && unread > 0 ? (
                        <span className="absolute -top-1 -right-1 size-2 rounded-full bg-live" />
                      ) : null}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {suggested.length ? (
              <div className="mb-4">
                <p className="px-3 text-[11px] tracking-widest text-muted uppercase">
                  {c.suggested}
                </p>
                <ul className="mt-2 space-y-1">
                  {suggested.map((item) => (
                    <li key={item.user} className="flex items-center gap-2 px-2">
                      <Link
                        to="/u/$user"
                        params={{ user: item.user }}
                        className="shrink-0"
                      >
                        <AvatarCircle
                          name={item.displayName}
                          src={avatars[item.user]}
                          size="sm"
                          className="size-8 text-[10px]"
                        />
                      </Link>
                      <Link
                        to="/u/$user"
                        params={{ user: item.user }}
                        className="min-w-0 flex-1 truncate text-xs"
                      >
                        @{item.user}
                      </Link>
                      <button
                        type="button"
                        className="text-[11px] font-medium text-primary"
                        onClick={() => toggleFollow(item.user)}
                      >
                        {c.follow}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {user ? (
              <Button variant="gold-outline" onClick={logout}>
                {c.signOut}
              </Button>
            ) : (
              <Link
                to="/entrar"
                search={{ from: pathname }}
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
              >
                {c.signIn}
              </Link>
            )}
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {user
                ? guest
                  ? c.guestSidebar(formatGuestRemaining(guestRemainingMs))
                  : c.signedInAs(user)
                : c.connectHint}
            </p>
            <Link to="/ajustes" className="mt-2 text-xs text-primary hover:underline">
              {c.settings}
            </Link>
            {backend !== "live" ? <BackendBadge status={backend} /> : null}
          </aside>

          <main className="md:pl-56">
            {guest && !isFeedPath(pathname) ? <GuestChip overlay={false} /> : null}
            {guest && isFeedPath(pathname) ? <GuestChip overlay /> : null}
            {!isFeedPath(pathname) ? (
              <div className="fixed top-3 right-3 z-30 md:hidden">
                <LangToggle compact />
              </div>
            ) : null}
            <div
              className={cn(
                "mx-auto min-h-dvh",
                isFeedPath(pathname)
                  ? "max-w-none overflow-hidden"
                  : "max-w-5xl pb-16 md:pb-0",
              )}
            >
              {children}
            </div>
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-surface/95 backdrop-blur-sm md:hidden">
            {mobileNav.map((item) => {
              const Icon = item.icon;
              const active =
                item.to === "/"
                  ? isFeedPath(pathname)
                  : pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (item.tab) setTab(item.tab);
                  }}
                  className={cn(
                    "flex h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs",
                    item.plus
                      ? "text-primary-fg"
                      : active
                        ? "text-primary"
                        : "text-muted",
                  )}
                >
                  {item.plus ? (
                    <span className="grid size-9 -mt-1 place-items-center rounded-md bg-primary text-primary-fg">
                      <Icon className="size-5" strokeWidth={2} />
                    </span>
                  ) : (
                    <span className="relative">
                      <Icon className="size-5" strokeWidth={1.75} />
                      {item.to === "/inbox" && unread > 0 ? (
                        <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-live" />
                      ) : null}
                    </span>
                  )}
                  {item.plus ? null : item.label}
                </Link>
              );
            })}
          </nav>
          <Onboard />
        </>
      )}
      {toast ? <Toast text={toast} /> : null}
    </div>
  );
}

function Toast({ text }: { text: string }) {
  return (
    <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full border border-border bg-elevated px-4 py-2 text-sm md:bottom-8">
      {text}
    </div>
  );
}

function BackendBadge({ status }: { status: "loading" | "live" | "offline" }) {
  const c = useCopy();
  const label =
    status === "live"
      ? c.liveBadge
      : status === "offline"
        ? c.offlineBadge
        : c.loadingBadge;
  return (
    <p
      className={cn(
        "mt-3 flex items-center gap-2 text-[11px] tracking-wide uppercase",
        status === "live" ? "text-primary" : "text-muted",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "live"
            ? "bg-primary"
            : status === "offline"
              ? "bg-live"
              : "bg-muted",
        )}
      />
      {label}
    </p>
  );
}

function AgeGate() {
  const c = useCopy();
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    setOk(localStorage.getItem(AGE_KEY) === "1");
    setReady(true);
  }, []);

  if (!ready || ok) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-bg/92 p-4">
      <div className="auth-card w-full max-w-sm rounded-xl p-6 text-center">
        <LangToggle className="mx-auto" />
        <p className="mt-4 font-display text-2xl text-primary">{region.brand.toUpperCase()}</p>
        <p className="mt-3 text-sm text-fg/90">{c.ageBody}</p>
        <button
          type="button"
          className="mt-6 h-12 w-full rounded-md bg-primary text-sm font-semibold text-primary-fg"
          onClick={() => {
            localStorage.setItem(AGE_KEY, "1");
            setOk(true);
          }}
        >
          {c.ageCta}
        </button>
      </div>
    </div>
  );
}

function GuestChip({ overlay }: { overlay: boolean }) {
  const remaining = useOjea((s) => s.guestRemainingMs);
  const c = useCopy();
  return (
    <Link
      to="/registro"
      className={cn(
        "z-30 rounded-full border border-primary/40 bg-surface/95 px-4 py-2 text-xs font-medium text-primary shadow-lg backdrop-blur-sm",
        overlay
          ? "fixed top-3 left-1/2 -translate-x-1/2 md:left-[calc(7rem+50%)]"
          : "mx-auto mt-4 mb-1 flex w-fit md:mt-6",
      )}
    >
      {c.guestChip(formatGuestRemaining(remaining))}
    </Link>
  );
}

function Onboard() {
  const c = useCopy();
  const userId = useOjea((s) => s.userId);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const steps = [
    { title: c.onboard1Title, body: c.onboard1Body },
    { title: c.onboard2Title, body: c.onboard2Body },
    { title: c.onboard3Title, body: c.onboard3Body },
  ];

  useEffect(() => {
    if (!userId) return;
    if (localStorage.getItem(ONBOARD_KEY) === "1") return;
    setOpen(true);
  }, [userId]);

  if (!open) return null;
  const current = steps[step] ?? steps[0];

  function finish() {
    localStorage.setItem(ONBOARD_KEY, "1");
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-bg/80 p-4">
      <div className="auth-card w-full max-w-sm rounded-xl p-6">
        <p className="text-xs tracking-[0.22em] text-muted uppercase">
          {step + 1} / {steps.length}
        </p>
        <h2 className="mt-2 font-display text-3xl text-primary">{current.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-fg/90">{current.body}</p>
        <div className="mt-6 flex gap-2">
          {step < steps.length - 1 ? (
            <Button className="w-full" onClick={() => setStep((s) => s + 1)}>
              {c.next}
            </Button>
          ) : (
            <Button className="w-full" onClick={finish}>
              {c.start}
            </Button>
          )}
        </div>
        <button
          type="button"
          className="mt-3 w-full text-center text-xs text-muted"
          onClick={finish}
        >
          {c.skip}
        </button>
      </div>
    </div>
  );
}
