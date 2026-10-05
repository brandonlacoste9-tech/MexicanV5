import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/seguridad-infantil")({
  component: SeguridadInfantil,
  head: () =>
    seoHead({
      path: "/seguridad-infantil",
      title: "Seguridad infantil",
      description:
        "Normas de seguridad infantil de Otealo: cero tolerancia al abuso y la explotación de menores.",
    }),
});

function SeguridadInfantil() {
  return (
    <LegalPage title="Seguridad infantil" updated="octubre de 2026">
      <p>
        Otealo tiene <strong>cero tolerancia</strong> con el abuso y la
        explotación sexual infantil. Estas normas aplican a todo el contenido
        de la plataforma: videos, comentarios, mensajes y perfiles.
      </p>
      <h2 className="font-display text-xl">Lo que está prohibido</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Cualquier contenido sexual que involucre a menores de 18 años, real
          o simulado, incluyendo dibujos, animaciones o contenido generado por
          IA.
        </li>
        <li>
          El acoso, la manipulación ("grooming") o la solicitud de contenido
          íntimo a menores.
        </li>
        <li>
          La sexualización de menores en videos, comentarios, descripciones o
          mensajes.
        </li>
        <li>
          Publicar datos personales de menores (nombre completo, escuela,
          domicilio, ubicación en tiempo real).
        </li>
      </ul>
      <h2 className="font-display text-xl">Edad mínima</h2>
      <p>
        Otealo es para personas de <strong>13 años o más</strong>. Las cuentas
        de menores de 13 años se eliminan al detectarlas.
      </p>
      <h2 className="font-display text-xl">Cómo reportar</h2>
      <p>
        Si ves algo que ponga en riesgo a un menor, repórtalo desde el video o
        desde el perfil del creador. Los reportes de seguridad infantil se
        revisan con prioridad. También puedes escribirnos a{" "}
        <a
          className="text-primary hover:underline"
          href="mailto:brandonlacoste9@gmail.com"
        >
          brandonlacoste9@gmail.com
        </a>{" "}
        con el asunto "Seguridad infantil".
      </p>
      <h2 className="font-display text-xl">Qué hacemos</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Eliminamos el contenido infractor y cerramos las cuentas responsables.</li>
        <li>
          Cooperamos con las autoridades cuando la ley lo requiere, incluyendo
          el reporte a las líneas de denuncia correspondientes.
        </li>
        <li>
          Revisamos y actualizamos estas normas de forma continua para mantener
          a la comunidad segura.
        </li>
      </ul>
    </LegalPage>
  );
}
