import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AuthError,
  AuthField,
  AuthLegal,
  AuthScreen,
  AuthSwitch,
  GoogleBtn,
  authInputClass,
} from "@/components/auth-screen";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/i18n";
import { AUTH_PATHS } from "@/lib/session";
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/entrar")({
  validateSearch: (s: Record<string, unknown> & SearchSchemaInput) => ({
    from: typeof s.from === "string" ? s.from : undefined,
  }),
  component: Entrar,
});

function Entrar() {
  const { from } = Route.useSearch();
  const router = useRouter();
  const c = useCopy();
  const login = useOjea((s) => s.login);
  const loginGoogle = useOjea((s) => s.loginGoogle);
  const enterGuest = useOjea((s) => s.enterGuest);
  const userId = useOjea((s) => s.userId);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function goHome() {
    const target =
      from && from.startsWith("/") && !AUTH_PATHS.has(from) ? from : "/";
    router.history.push(target);
  }

  useEffect(() => {
    if (userId) goHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <AuthScreen>
      <h2 className="font-display text-2xl text-fg">{c.signInTitle}</h2>
      <p className="mt-1 mb-6 text-sm text-muted">{c.signInLead}</p>
      <AuthError message={error} />
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const name = String(data.get("name") ?? "");
          const password = String(data.get("password") ?? "");
          setPending(true);
          setError(null);
          void login(name, password, "in").then((err) => {
            setPending(false);
            if (err) setError(err);
            else goHome();
          });
        }}
      >
        <AuthField label={c.emailOrUser}>
          <input
            name="name"
            autoComplete="username"
            required
            placeholder={c.emailOrUserPh}
            className={authInputClass()}
          />
        </AuthField>
        <AuthField label={c.password}>
          <div className="relative">
            <input
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={6}
              placeholder="••••••••"
              className={`${authInputClass()} pr-12`}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted"
              onClick={() => setShow((v) => !v)}
            >
              {show ? c.hide : c.show}
            </button>
          </div>
        </AuthField>
        <div className="text-right">
          <Link to="/recuperar" className="text-xs text-primary hover:underline">
            {c.forgot}
          </Link>
        </div>
        <Button className="w-full" size="lg" disabled={pending} type="submit">
          {pending ? c.connecting : c.enter}
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        {c.or}
        <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleBtn
        pending={pending}
        onClick={() => {
          setPending(true);
          setError(null);
          void loginGoogle().then((err) => {
            if (err) {
              setPending(false);
              setError(err);
            }
          });
        }}
      />
      <Button
        type="button"
        variant="gold-outline"
        className="mt-3 w-full"
        disabled={pending}
        onClick={() => {
          enterGuest();
          goHome();
        }}
      >
        {c.continueGuest}
      </Button>
      <div className="mt-6 space-y-3">
        <AuthSwitch prompt={c.noAccountQ} to="/registro" label={c.createIt} />
        <AuthLegal />
      </div>
    </AuthScreen>
  );
}
