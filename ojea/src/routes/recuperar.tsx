import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthError,
  AuthField,
  AuthScreen,
  authInputClass,
} from "@/components/auth-screen";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/i18n";
import { requestPasswordReset } from "@/lib/ojea-api";

export const Route = createFileRoute("/recuperar")({ component: Recuperar });

function Recuperar() {
  const c = useCopy();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (sent) {
    return (
      <AuthScreen>
        <h2 className="font-display text-2xl text-primary">{c.checkMail}</h2>
        <p className="mt-4 text-sm text-fg">{c.sentTo(email)}</p>
        <p className="mt-3 text-sm text-muted">{c.spamHint}</p>
        <Link
          to="/entrar"
          className="mt-6 flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-fg"
        >
          {c.backToSignIn}
        </Link>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <h2 className="font-display text-2xl text-fg">{c.recoverTitle}</h2>
      <p className="mt-2 mb-6 text-sm text-muted">{c.recoverLead}</p>
      <AuthError message={error} />
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setPending(true);
          setError(null);
          void requestPasswordReset(email)
            .then(() => setSent(true))
            .catch((err) =>
              setError(err instanceof Error ? err.message : c.errReset),
            )
            .finally(() => setPending(false));
        }}
      >
        <AuthField label={c.email}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={c.emailPh}
            className={authInputClass()}
          />
        </AuthField>
        <Button className="w-full" size="lg" disabled={pending} type="submit">
          {pending ? c.sending : c.sendLink}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link to="/entrar" className="text-primary hover:underline">
          {c.backToSignIn}
        </Link>
      </p>
    </AuthScreen>
  );
}
