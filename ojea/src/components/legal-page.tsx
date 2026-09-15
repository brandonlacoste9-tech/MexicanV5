import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useCopy } from "@/lib/i18n";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  const c = useCopy();
  return (
    <article className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">{c.legalMexico}</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted">{c.legalUpdated(updated)}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-fg/85">{children}</div>
      <p className="mt-10 text-sm">
        <Link to="/entrar" className="text-primary hover:underline">
          {c.backToSignIn}
        </Link>
        {" · "}
        <Link to="/" className="text-primary hover:underline">
          {c.navForYou}
        </Link>
      </p>
    </article>
  );
}
