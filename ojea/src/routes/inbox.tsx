import { createFileRoute, Link } from "@tanstack/react-router";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useCopy, type Copy } from "@/lib/i18n";
import { useOjea, type Note } from "@/lib/store";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/inbox")({
  validateSearch: (s: Record<string, unknown> & SearchSchemaInput) => ({
    to: typeof s.to === "string" ? s.to : undefined,
  }),
  head: () => seoHead({ path: "/inbox", title: "Buzón", noIndex: true }),
  component: Inbox,
});

function noteCopy(c: Copy, note: Note) {
  if (note.id === "n1") return { text: c.noteN1, time: c.noteN1t };
  if (note.id === "n2") return { text: c.noteN2, time: c.noteN2t };
  if (note.id === "n3") return { text: c.noteN3, time: c.noteN3t };
  if (note.id === "n4") return { text: c.noteN4, time: c.noteN4t };
  return { text: note.text, time: note.time };
}

function Inbox() {
  const { to } = Route.useSearch();
  const c = useCopy();
  const {
    notes,
    markNotesRead,
    user,
    userId,
    guest,
    openAuth,
    dms,
    directory,
    sendMessage,
  } = useOjea();
  const [pane, setPane] = useState<"actividad" | "mensajes">(
    to ? "mensajes" : "actividad",
  );
  const [toUser, setToUser] = useState(to ?? "");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [openThread, setOpenThread] = useState<string | null>(to ?? null);

  useEffect(() => {
    const t = window.setTimeout(() => markNotesRead(), 800);
    return () => window.clearTimeout(t);
  }, [markNotesRead]);

  useEffect(() => {
    if (to) {
      setPane("mensajes");
      setToUser(to);
      setOpenThread(to);
    }
  }, [to]);

  const threads = useMemo(() => {
    if (!user) return [];
    const map = new Map<
      string,
      { user: string; last: string; at: string; count: number }
    >();
    for (const m of dms) {
      const other = m.sender === user ? m.recipient : m.sender;
      const prev = map.get(other);
      map.set(other, {
        user: other,
        last: m.body,
        at: m.createdAt,
        count: (prev?.count ?? 0) + 1,
      });
    }
    return [...map.values()].sort((a, b) => b.at.localeCompare(a.at));
  }, [dms, user]);

  const threadMessages = useMemo(() => {
    if (!user || !openThread) return [];
    return dms.filter(
      (m) =>
        (m.sender === user && m.recipient === openThread) ||
        (m.sender === openThread && m.recipient === user),
    );
  }, [dms, openThread, user]);

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <h1 className="font-display text-3xl tracking-tight">{c.inboxTitle}</h1>
      <p className="mt-2 text-sm text-muted">
        {c.inboxLead}{" "}
        {userId ? null : (
          <button type="button" className="text-primary" onClick={openAuth}>
            {c.signIn}
          </button>
        )}
      </p>

      <div className="mt-6 flex gap-4 border-b border-border">
        {(
          [
            ["actividad", c.activity],
            ["mensajes", c.messages],
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

      {pane === "actividad" ? (
        notes.length ? (
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {notes.map((n) => (
            <ActivityRow key={n.id} note={n} />
          ))}
        </ul>
        ) : (
          <p className="mt-6 text-sm text-muted">{c.activityEmpty}</p>
        )
      ) : guest || !userId ? (
        <div className="mt-6 rounded-xl border border-border bg-elevated p-5">
          <p className="text-sm text-fg/90">{c.dmGuest}</p>
          <Link
            to="/entrar"
            search={{ from: "/inbox" }}
            className="mt-4 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
          >
            {c.enterToWrite}
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <form
            className="rounded-xl border border-border bg-elevated p-4"
            onSubmit={(e) => {
              e.preventDefault();
              setPending(true);
              setError(null);
              void sendMessage(toUser, body).then((err) => {
                setPending(false);
                if (err) setError(err);
                else {
                  setBody("");
                  setOpenThread(toUser.replace(/^@/, "").trim());
                }
              });
            }}
          >
            <label className="block text-xs text-muted">{c.toLabel}</label>
            <input
              value={toUser}
              onChange={(e) => setToUser(e.target.value)}
              list="ojea-users"
              placeholder={c.toPh}
              className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:outline-2 focus:outline-primary"
            />
            <datalist id="ojea-users">
              {directory.map((u) => (
                <option key={u.username} value={u.username}>
                  {u.displayName}
                </option>
              ))}
            </datalist>
            <label className="mt-3 block text-xs text-muted">{c.message}</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder={c.messagePh}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:outline-2 focus:outline-primary"
            />
            {error ? <p className="mt-2 text-sm text-live">{error}</p> : null}
            <Button className="mt-3 w-full" disabled={pending} type="submit">
              {pending ? c.sending : c.send}
            </Button>
          </form>

          {threads.length === 0 ? (
            <p className="text-sm text-muted">{c.noThreads}</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {threads.map((thread) => (
                <li key={thread.user}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenThread(thread.user);
                      setToUser(thread.user);
                    }}
                    className="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-elevated"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-primary/40 bg-surface text-xs text-primary">
                      {thread.user.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">@{thread.user}</p>
                      <p className="truncate text-xs text-muted">{thread.last}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {openThread && threadMessages.length ? (
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs tracking-wide text-muted uppercase">
                {c.threadWith(openThread)}
              </p>
              <ul className="mt-3 space-y-2">
                {threadMessages.map((m) => (
                  <li
                    key={m.id}
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                      m.sender === user
                        ? "ml-auto bg-primary text-primary-fg"
                        : "bg-elevated text-fg",
                    )}
                  >
                    {m.body}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ActivityRow({ note }: { note: Note }) {
  const navigate = Route.useNavigate();
  const c = useCopy();
  const shown = noteCopy(c, note);

  function openNote(n: Note) {
    if (n.kind === "user" && n.user) {
      void navigate({ to: "/u/$user", params: { user: n.user } });
      return;
    }
    if (n.kind === "sound" && n.sound) {
      void navigate({ to: "/sonido/$id", params: { id: n.sound } });
      return;
    }
    void navigate({ to: "/" });
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => openNote(note)}
        className="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-elevated"
      >
        {note.unread ? (
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
        ) : (
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-border" />
        )}
        <div>
          <p className="text-sm">{shown.text}</p>
          <p className="mt-1 text-xs text-muted">{shown.time}</p>
        </div>
      </button>
    </li>
  );
}
