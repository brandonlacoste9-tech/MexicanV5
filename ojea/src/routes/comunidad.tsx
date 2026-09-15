import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { useCopy } from "@/lib/i18n";

export const Route = createFileRoute("/comunidad")({ component: Comunidad });

function Comunidad() {
  const c = useCopy();
  return (
    <LegalPage title={c.communityTitle} updated={c.legalDate}>
      <p>{c.communityIntro}</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>{c.community1}</li>
        <li>{c.community2}</li>
        <li>{c.community3}</li>
        <li>{c.community4}</li>
        <li>{c.community5}</li>
      </ul>
      <p>{c.communityOut}</p>
    </LegalPage>
  );
}
