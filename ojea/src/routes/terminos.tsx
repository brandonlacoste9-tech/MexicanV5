import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { useCopy } from "@/lib/i18n";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/terminos")({
  component: Terminos,
  head: () =>
    seoHead({
      path: "/terminos",
      title: "Términos de uso",
      description: "Reglas de Otealo. App de clips de la calle mexicana.",
    }),
});

function Terminos() {
  const c = useCopy();
  return (
    <LegalPage title={c.termsTitle} updated={c.legalDate}>
      <p>{c.termsIntro}</p>
      <h2 className="font-display text-xl text-primary">{c.termsAgeH}</h2>
      <p>{c.termsAge}</p>
      <h2 className="font-display text-xl text-primary">{c.termsAccountH}</h2>
      <p>{c.termsAccount}</p>
      <h2 className="font-display text-xl text-primary">{c.termsContentH}</h2>
      <p>{c.termsContent}</p>
      <h2 className="font-display text-xl text-primary">{c.termsGuestH}</h2>
      <p>{c.termsGuest}</p>
    </LegalPage>
  );
}
