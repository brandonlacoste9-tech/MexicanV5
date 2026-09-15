import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
import { useOjea } from "@/lib/store";

export const Route = createFileRoute("/registro")({ component: Registro });

function Registro() {
  const navigate = useNavigate();
  const c = useCopy();
  const login = useOjea((s) => s.login);
  const loginGoogle = useOjea((s) => s.loginGoogle);
  const enterGuest = useOjea((s) => s.enterGuest);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <AuthScreen>
      <h2 className="font-display text-2xl text-fg">{c.signUpTitle}</h2>
      <p className="mt-1 mb-6 text-sm text-muted">{c.signUpLead}</p>
      <AuthError message={error} />
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const username = String(data.get("username") ?? "");
          const email = String(data.get("email") ?? "");
          const password = String(data.get("password") ?? "");
          setPending(true);
          setError(null);
          void login(username, password, "up", email).then((err) => {
            setPending(false);
            if (err) setError(err);
            else void navigate({ to: "/" });
          });
        }}
      >
        <AuthField label={c.username}>
          <input
            name="username"
            autoComplete="username"
            required
            minLength={3}
            placeholder={c.usernamePh}
            className={authInputClass()}
            onChange={(e) => {
              e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "");
            }}
          />
        </AuthField>
        <AuthField label={c.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={c.emailPh}
            className={authInputClass()}
          />
        </AuthField>
        <AuthField label={c.password}>
          <div className="relative">
            <input
              name="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder={c.passwordPh}
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
        <Button className="w-full" size="lg" disabled={pending} type="submit">
          {pending ? c.creating : c.createMine}
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
          void navigate({ to: "/" });
        }}
      >
        {c.continueGuest}
      </Button>
      <div className="mt-6 space-y-3">
        <AuthSwitch prompt={c.haveAccount} to="/entrar" label={c.enterLink} />
        <AuthLegal />
      </div>
    </AuthScreen>
  );
}
