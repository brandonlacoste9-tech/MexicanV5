import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { useCopy } from "@/lib/i18n";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/privacidad")({
  component: Privacidad,
  head: () =>
    seoHead({
      path: "/privacidad",
      title: "Privacidad",
      description: "Cómo Otealo trata tus datos. México.",
    }),
});

function Privacidad() {
  const c = useCopy();
  return (
    <LegalPage title={c.privacyTitle} updated={c.legalDate}>
      <p>{c.privacyIntro}</p>
      <h2 className="font-display text-xl text-primary">{c.privacyWhereH}</h2>
      <p>{c.privacyWhere}</p>
      <h2 className="font-display text-xl text-primary">{c.privacyNotH}</h2>
      <p>{c.privacyNot}</p>
      <h2 className="font-display text-xl text-primary">{c.privacyYouH}</h2>
      <p>{c.privacyYou}</p>
    </LegalPage>
  );
}
