import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthError,
  AuthField,
  AuthScreen,
  authInputClass,
} from "@/components/auth-screen";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/i18n";
import { updateAccountPassword } from "@/lib/ojea-api";

export const Route = createFileRoute("/nueva-clave")({ component: NuevaClave });

function NuevaClave() {
  const navigate = useNavigate();
  const c = useCopy();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <AuthScreen>
      <h2 className="font-display text-2xl text-fg">{c.newPassword}</h2>
      <p className="mt-2 mb-6 text-sm text-muted">{c.newPasswordLead}</p>
      <AuthError message={error} />
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const password = String(data.get("password") ?? "");
          const confirm = String(data.get("confirm") ?? "");
          if (password !== confirm) {
            setError(c.errMismatch);
            return;
          }
          setPending(true);
          setError(null);
          void updateAccountPassword(password)
            .then(() => navigate({ to: "/" }))
            .catch((err) =>
              setError(err instanceof Error ? err.message : c.errGeneric),
            )
            .finally(() => setPending(false));
        }}
      >
        <AuthField label={c.newPassword}>
          <div className="relative">
            <input
              name="password"
              type={show ? "text" : "password"}
              required
              minLength={8}
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
        <AuthField label={c.confirm}>
          <input
            name="confirm"
            type={show ? "text" : "password"}
            required
            minLength={8}
            className={authInputClass()}
          />
        </AuthField>
        <Button className="w-full" size="lg" disabled={pending} type="submit">
          {pending ? c.saving : c.savePassword}
        </Button>
      </form>
    </AuthScreen>
  );
}
