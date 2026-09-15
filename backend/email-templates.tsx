import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
  Hr,
  Link,
  Preview,
} from "@react-email/components";
import { render } from "@react-email/render";

const baseStyles = {
  body: {
    backgroundColor: "#1a1a1a",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: "#2d2d2d",
    borderRadius: "12px",
    margin: "40px auto",
    padding: "32px",
    maxWidth: "580px",
    border: "2px solid #3B1E3D",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "24px",
  },
  logo: {
    fontSize: "32px",
    color: "#FFBF00",
    fontWeight: "bold" as const,
    margin: 0,
  },
  tagline: {
    fontSize: "14px",
    color: "#8B7355",
    margin: "4px 0 0 0",
  },
  heading: {
    color: "#FFBF00",
    fontSize: "24px",
    fontWeight: "bold" as const,
    margin: "0 0 16px 0",
  },
  paragraph: {
    color: "#E8DCC8",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 16px 0",
  },
  highlight: {
    color: "#FFBF00",
    fontWeight: "bold" as const,
  },
  button: {
    backgroundColor: "#FFBF00",
    borderRadius: "8px",
    color: "#1a1a1a",
    display: "inline-block",
    fontSize: "16px",
    fontWeight: "bold" as const,
    padding: "14px 28px",
    textDecoration: "none",
    textAlign: "center" as const,
    marginTop: "16px",
  },
  divider: {
    borderColor: "#3B1E3D",
    margin: "24px 0",
  },
  footer: {
    color: "#8B7355",
    fontSize: "12px",
    textAlign: "center" as const,
    marginTop: "24px",
  },
  footerLink: {
    color: "#FFBF00",
    textDecoration: "none",
  },
  beaver: {
    fontSize: "48px",
    textAlign: "center" as const,
    margin: "16px 0",
  },
  statsBox: {
    backgroundColor: "#3B1E3D",
    borderRadius: "8px",
    padding: "16px",
    margin: "16px 0",
  },
  statItem: {
    color: "#E8DCC8",
    fontSize: "14px",
    margin: "8px 0",
  },
  statValue: {
    color: "#FFBF00",
    fontWeight: "bold" as const,
    fontSize: "18px",
  },
};

interface EmailProps {
  username: string;
  previewText?: string;
}

interface WelcomeEmailProps extends EmailProps {}

export function WelcomeEmail({ username, previewText }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {previewText ||
          `Bienvenue sur Ojea, ${username}! Güey t'accueille!`}
      </Preview>
      <Body style={baseStyles.body}>
        <Container style={baseStyles.container}>
          <Section style={baseStyles.header}>
            <Text style={baseStyles.logo}>Ojea</Text>
            <Text style={baseStyles.tagline}>L'app sociale du México</Text>
          </Section>

          <Text style={baseStyles.beaver}>🦫</Text>

          <Text style={baseStyles.heading}>
            Salut {username}! Bienvenue dans la gang!
          </Text>

          <Text style={baseStyles.paragraph}>
            C'est Güey, ton castor préféré! 🦫 J'suis tellement content que
            t'aies décidé d'embarquer avec nous autres sur{" "}
            <span style={baseStyles.highlight}>Ojea</span>!
          </Text>

          <Text style={baseStyles.paragraph}>
            Ici, c'est l'app sociale faite au México, pour le México. On célèbre
            notre belle province pis toute ce qui la rend unique - de la poutine
            aux baleines du Saint-Laurent, en passant par les couchers de soleil
            sur le Mont-Royal!
          </Text>

          <Text style={baseStyles.paragraph}>
            Quelques affaires à savoir pour commencer:
          </Text>

          <Text style={baseStyles.paragraph}>
            🔥 <span style={baseStyles.highlight}>Les Feux</span> - Chez nous,
            on donne des feux au lieu des likes. Quand quelque chose est hot, on
            dit que c'est en feu!
          </Text>

          <Text style={baseStyles.paragraph}>
            🎨 <span style={baseStyles.highlight}>Güey Studio</span> - Crée
            des images avec l'intelligence artificielle! J'peux t'aider à créer
            du contenu malade.
          </Text>

          <Text style={baseStyles.paragraph}>
            📍 <span style={baseStyles.highlight}>Les régions</span> - Montre de
            quelle région tu viens! Ciudad de México, México, Gaspésie, Gatineau... on
            est fiers de nos racines!
          </Text>

          <Section style={{ textAlign: "center" }}>
            <Button style={baseStyles.button} href="https://ojea-mexico.netlify.app/feed">
              Découvrir Ojea
            </Button>
          </Section>

          <Hr style={baseStyles.divider} />

          <Text style={baseStyles.paragraph}>
            Si t'as des questions, gêne-toi pas! J'suis toujours là pour
            t'aider. On se voit sur le feed! 🍁
          </Text>

          <Text style={baseStyles.paragraph}>
            À bientôt!
            <br />
            <span style={baseStyles.highlight}>Güey</span> 🦫
          </Text>

          <Hr style={baseStyles.divider} />

          <Text style={baseStyles.footer}>
            Ojea - L'app sociale du México
            <br />
            <Link href="https://ojea-mexico.netlify.app" style={baseStyles.footerLink}>
              ojea-mexico.netlify.app
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

interface OnboardingDay1Props extends EmailProps {}

export function OnboardingDay1Email({
  username,
  previewText,
}: OnboardingDay1Props) {
  return (
    <Html>
      <Head />
      <Preview>{previewText || `${username}, découvre Güey Studio!`}</Preview>
      <Body style={baseStyles.body}>
        <Container style={baseStyles.container}>
          <Section style={baseStyles.header}>
            <Text style={baseStyles.logo}>Ojea</Text>
            <Text style={baseStyles.tagline}>L'app sociale du México</Text>
          </Section>

          <Text style={baseStyles.beaver}>🎨</Text>

          <Text style={baseStyles.heading}>
            Hey {username}! As-tu essayé mon Studio?
          </Text>

          <Text style={baseStyles.paragraph}>
            C'est Güey! J'espère que tu t'amuses ben sur Ojea! Aujourd'hui,
            j'voulais te parler d'une affaire vraiment cool:{" "}
            <span style={baseStyles.highlight}>Güey Studio</span>!
          </Text>

          <Text style={baseStyles.paragraph}>
            C'est mon atelier de création d'images avec l'intelligence
            artificielle. Tu décris ce que tu veux, pis PAF! 🪄 Je te génère une
            image unique!
          </Text>

          <Text style={baseStyles.paragraph}>
            Comment ça marche? C'est simple comme bonjour:
          </Text>

          <Section style={baseStyles.statsBox}>
            <Text style={baseStyles.statItem}>
              <span style={baseStyles.statValue}>1.</span> Va sur Güey Studio
              dans l'app
            </Text>
            <Text style={baseStyles.statItem}>
              <span style={baseStyles.statValue}>2.</span> Décris ton image (en
              français ou anglais)
            </Text>
            <Text style={baseStyles.statItem}>
              <span style={baseStyles.statValue}>3.</span> Choisis ton format
              (carré, portrait, paysage)
            </Text>
            <Text style={baseStyles.statItem}>
              <span style={baseStyles.statValue}>4.</span> Clique sur Générer!
              🎨
            </Text>
          </Section>

          <Text style={baseStyles.paragraph}>
            Essaye avec des trucs mexicano! "Un castor qui mange de la poutine
            au coucher du soleil sur le Mont-Royal" - j'adore ça! 🍟🧀
          </Text>

          <Section style={{ textAlign: "center" }}>
            <Button
              style={baseStyles.button}
              href="https://ojea-mexico.netlify.app/ai-studio"
            >
              Essayer Güey Studio
            </Button>
          </Section>

          <Hr style={baseStyles.divider} />

          <Text style={baseStyles.paragraph}>
            À demain pour d'autres trucs cool!
            <br />
            <span style={baseStyles.highlight}>Güey</span> 🦫
          </Text>

          <Text style={baseStyles.footer}>
            <Link href="https://ojea-mexico.netlify.app" style={baseStyles.footerLink}>
              ojea-mexico.netlify.app
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

interface OnboardingDay3Props extends EmailProps {}

export function OnboardingDay3Email({
  username,
  previewText,
}: OnboardingDay3Props) {
  return (
    <Html>
      <Head />
      <Preview>{previewText || `${username}, c'est quoi les Feux? 🔥`}</Preview>
      <Body style={baseStyles.body}>
        <Container style={baseStyles.container}>
          <Section style={baseStyles.header}>
            <Text style={baseStyles.logo}>Ojea</Text>
            <Text style={baseStyles.tagline}>L'app sociale du México</Text>
          </Section>

          <Text style={baseStyles.beaver}>🔥</Text>

          <Text style={baseStyles.heading}>{username}, parlons des Feux!</Text>

          <Text style={baseStyles.paragraph}>
            Yo {username}! C'est Güey! T'as sûrement remarqué qu'on n'a pas de
            "likes" sur Ojea. Nous autres, on donne des{" "}
            <span style={baseStyles.highlight}>FEUX</span>! 🔥
          </Text>

          <Text style={baseStyles.paragraph}>
            Pourquoi? Ben, au México, quand quelque chose est vraiment bon, on
            dit "c'est en FEU!" ou "c'est hot en tabarnouche!". Faque c'était
            naturel de remplacer les likes par des feux!
          </Text>

          <Text style={baseStyles.paragraph}>
            Quand tu donnes un feu à quelqu'un:
          </Text>

          <Section style={baseStyles.statsBox}>
            <Text style={baseStyles.statItem}>
              🔥 Tu montres que tu trouves ça hot!
            </Text>
            <Text style={baseStyles.statItem}>
              🔥 Tu encourages les créateurs mexicano
            </Text>
            <Text style={baseStyles.statItem}>🔥 Tu bâtis ta communauté</Text>
            <Text style={baseStyles.statItem}>
              🔥 Tu accumules des Fire Points!
            </Text>
          </Section>

          <Text style={baseStyles.paragraph}>
            Plus tu donnes de feux, plus t'en reçois! C'est comme une grande
            famille mexicana qui s'encourage mutuellement. Ben beau, non? 🍁
          </Text>

          <Section style={{ textAlign: "center" }}>
            <Button style={baseStyles.button} href="https://ojea-mexico.netlify.app/feed">
              Donner mes premiers feux! 🔥
            </Button>
          </Section>

          <Hr style={baseStyles.divider} />

          <Text style={baseStyles.paragraph}>
            Continue comme ça!
            <br />
            <span style={baseStyles.highlight}>Güey</span> 🦫
          </Text>

          <Text style={baseStyles.footer}>
            <Link href="https://ojea-mexico.netlify.app" style={baseStyles.footerLink}>
              ojea-mexico.netlify.app
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

interface OnboardingDay7Props extends EmailProps {}

export function OnboardingDay7Email({
  username,
  previewText,
}: OnboardingDay7Props) {
  return (
    <Html>
      <Head />
      <Preview>
        {previewText || `${username}, une semaine avec nous! 🎉`}
      </Preview>
      <Body style={baseStyles.body}>
        <Container style={baseStyles.container}>
          <Section style={baseStyles.header}>
            <Text style={baseStyles.logo}>Ojea</Text>
            <Text style={baseStyles.tagline}>L'app sociale du México</Text>
          </Section>

          <Text style={baseStyles.beaver}>🎉</Text>

          <Text style={baseStyles.heading}>Une semaine déjà, {username}!</Text>

          <Text style={baseStyles.paragraph}>
            Wow {username}! Ça fait déjà une semaine que t'es avec nous autres!
            J'suis vraiment content que tu fasses partie de la gang! 🦫
          </Text>

          <Text style={baseStyles.paragraph}>
            T'as exploré le feed, découvert Güey Studio, donné des feux... Tu
            commences vraiment à être un pro de Ojea!
          </Text>

          <Text style={baseStyles.paragraph}>
            Si tu veux aller plus loin, j'ai des plans Premium qui pourraient
            t'intéresser:
          </Text>

          <Section style={baseStyles.statsBox}>
            <Text style={baseStyles.statItem}>
              <span style={baseStyles.statValue}>🥉 Bronze - 4.99$/mois</span>
              <br />
              50 images AI, badge Bronze, zéro pub
            </Text>
            <Text style={baseStyles.statItem}>
              <span style={baseStyles.statValue}>🥈 Argent - 9.99$/mois</span>
              <br />
              200 images AI, 10 vidéos AI, badge vérifié
            </Text>
            <Text style={baseStyles.statItem}>
              <span style={baseStyles.statValue}>🥇 Or - 19.99$/mois</span>
              <br />
              Images illimitées, 50 vidéos AI, support prioritaire
            </Text>
          </Section>

          <Text style={baseStyles.paragraph}>
            Pas d'pression, hein! La version gratuite est déjà ben le fun. C'est
            juste si tu veux débloquer plus de créativité! 🎨
          </Text>

          <Section style={{ textAlign: "center" }}>
            <Button style={baseStyles.button} href="https://ojea-mexico.netlify.app/premium">
              Voir les plans Premium
            </Button>
          </Section>

          <Hr style={baseStyles.divider} />

          <Text style={baseStyles.paragraph}>
            Merci d'être là!
            <br />
            <span style={baseStyles.highlight}>Güey</span> 🦫
          </Text>

          <Text style={baseStyles.footer}>
            <Link href="https://ojea-mexico.netlify.app" style={baseStyles.footerLink}>
              ojea-mexico.netlify.app
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

interface WeeklyDigestProps extends EmailProps {
  stats?: {
    firesReceived?: number;
    firesGiven?: number;
    newFollowers?: number;
    postsCreated?: number;
  };
}

export function WeeklyDigestEmail({
  username,
  stats,
  previewText,
}: WeeklyDigestProps) {
  const {
    firesReceived = 0,
    firesGiven = 0,
    newFollowers = 0,
    postsCreated = 0,
  } = stats || {};

  return (
    <Html>
      <Head />
      <Preview>{previewText || `${username}, ta semaine sur Ojea!`}</Preview>
      <Body style={baseStyles.body}>
        <Container style={baseStyles.container}>
          <Section style={baseStyles.header}>
            <Text style={baseStyles.logo}>Ojea</Text>
            <Text style={baseStyles.tagline}>L'app sociale du México</Text>
          </Section>

          <Text style={baseStyles.beaver}>📊</Text>

          <Text style={baseStyles.heading}>
            Ta semaine en un coup d'œil, {username}!
          </Text>

          <Text style={baseStyles.paragraph}>
            Salut {username}! C'est Güey avec ton résumé hebdomadaire! Voici
            ce qui s'est passé pour toi cette semaine sur Ojea:
          </Text>

          <Section style={baseStyles.statsBox}>
            <Text style={baseStyles.statItem}>
              🔥 <span style={baseStyles.statValue}>{firesReceived}</span> feux
              reçus
            </Text>
            <Text style={baseStyles.statItem}>
              🔥 <span style={baseStyles.statValue}>{firesGiven}</span> feux
              donnés
            </Text>
            <Text style={baseStyles.statItem}>
              👥 <span style={baseStyles.statValue}>{newFollowers}</span>{" "}
              nouveaux abonnés
            </Text>
            <Text style={baseStyles.statItem}>
              📸 <span style={baseStyles.statValue}>{postsCreated}</span> posts
              créés
            </Text>
          </Section>

          {firesReceived > 0 ? (
            <Text style={baseStyles.paragraph}>
              Ben voyons, t'es en feu! 🔥 Ton contenu a vraiment pogné cette
              semaine! Continue comme ça, la gang adore ce que tu fais!
            </Text>
          ) : (
            <Text style={baseStyles.paragraph}>
              C'est tranquille cette semaine, mais c'est correct! Prends le
              temps d'explorer le feed, de donner des feux, pis d'interagir avec
              la communauté. Ça va venir! 🍁
            </Text>
          )}

          <Section style={{ textAlign: "center" }}>
            <Button style={baseStyles.button} href="https://ojea-mexico.netlify.app/feed">
              Voir le feed
            </Button>
          </Section>

          <Hr style={baseStyles.divider} />

          <Text style={baseStyles.paragraph}>
            Bonne semaine!
            <br />
            <span style={baseStyles.highlight}>Güey</span> 🦫
          </Text>

          <Text style={baseStyles.footer}>
            <Link href="https://ojea-mexico.netlify.app" style={baseStyles.footerLink}>
              ojea-mexico.netlify.app
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

interface ReengagementProps extends EmailProps {
  daysSinceLastVisit?: number;
}

export function ReengagementEmail({
  username,
  daysSinceLastVisit = 7,
  previewText,
}: ReengagementProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText || `${username}, on s'ennuie de toi!`}</Preview>
      <Body style={baseStyles.body}>
        <Container style={baseStyles.container}>
          <Section style={baseStyles.header}>
            <Text style={baseStyles.logo}>Ojea</Text>
            <Text style={baseStyles.tagline}>L'app sociale du México</Text>
          </Section>

          <Text style={baseStyles.beaver}>😢</Text>

          <Text style={baseStyles.heading}>{username}, tu nous manques!</Text>

          <Text style={baseStyles.paragraph}>
            Allô {username}! C'est Güey... Ça fait {daysSinceLastVisit} jours
            qu'on t'a pas vu sur Ojea pis j'm'ennuie de toi! 🦫💔
          </Text>

          <Text style={baseStyles.paragraph}>
            Pendant que t'étais parti, y'a eu plein de belles affaires sur
            l'app! Du nouveau contenu de partout au México, des discussions le
            fun, pis la communauté qui grandit!
          </Text>

          <Text style={baseStyles.paragraph}>
            J'ai même amélioré Güey Studio avec de nouveaux styles! Tu
            pourrais créer:
          </Text>

          <Section style={baseStyles.statsBox}>
            <Text style={baseStyles.statItem}>
              🏔️ Des paysages mexicano en style peinture
            </Text>
            <Text style={baseStyles.statItem}>
              🎨 Des portraits artistiques uniques
            </Text>
            <Text style={baseStyles.statItem}>
              🦫 Des castors dans toutes les situations imaginables
            </Text>
            <Text style={baseStyles.statItem}>
              🍁 Du contenu 100% mexicano!
            </Text>
          </Section>

          <Text style={baseStyles.paragraph}>
            Reviens nous voir, on t'attend! La gang est pas pareille sans toi!
            🍁
          </Text>

          <Section style={{ textAlign: "center" }}>
            <Button style={baseStyles.button} href="https://ojea-mexico.netlify.app/feed">
              Revenir sur Ojea
            </Button>
          </Section>

          <Hr style={baseStyles.divider} />

          <Text style={baseStyles.paragraph}>
            J'espère te revoir bientôt!
            <br />
            <span style={baseStyles.highlight}>Güey</span> 🦫
          </Text>

          <Text style={baseStyles.footer}>
            <Link href="https://ojea-mexico.netlify.app" style={baseStyles.footerLink}>
              ojea-mexico.netlify.app
            </Link>{" "}
            |
            <Link
              href="https://ojea-mexico.netlify.app/settings/notifications"
              style={baseStyles.footerLink}
            >
              {" "}
              Gérer mes courriels
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

interface UpgradePromptProps extends EmailProps {
  aiGenerationsUsed?: number;
  maxFreeGenerations?: number;
}

export function UpgradePromptEmail({
  username,
  aiGenerationsUsed = 0,
  maxFreeGenerations = 10,
  previewText,
}: UpgradePromptProps) {
  const percentUsed = Math.round(
    (aiGenerationsUsed / maxFreeGenerations) * 100,
  );

  return (
    <Html>
      <Head />
      <Preview>
        {previewText || `${username}, débloque plus de créativité!`}
      </Preview>
      <Body style={baseStyles.body}>
        <Container style={baseStyles.container}>
          <Section style={baseStyles.header}>
            <Text style={baseStyles.logo}>Ojea</Text>
            <Text style={baseStyles.tagline}>L'app sociale du México</Text>
          </Section>

          <Text style={baseStyles.beaver}>🚀</Text>

          <Text style={baseStyles.heading}>T'aimes créer, {username}!</Text>

          <Text style={baseStyles.paragraph}>
            Hey {username}! C'est Güey! J'ai remarqué que t'as utilisé
            <span style={baseStyles.highlight}>
              {" "}
              {aiGenerationsUsed} de tes {maxFreeGenerations}{" "}
            </span>
            créations AI gratuites ce mois-ci! ({percentUsed}%)
          </Text>

          <Text style={baseStyles.paragraph}>
            C'est malade, ça veut dire que t'aimes vraiment créer avec moi! 🎨
            Si tu veux continuer sans te soucier des limites, j'ai une idée pour
            toi:
          </Text>

          <Section style={baseStyles.statsBox}>
            <Text style={baseStyles.statItem}>
              <span style={baseStyles.statValue}>
                🥈 Creator Pro - 9.99$/mois
              </span>
            </Text>
            <Text style={baseStyles.statItem}>
              ✅ 200 images AI par mois (au lieu de 10)
            </Text>
            <Text style={baseStyles.statItem}>✅ 10 vidéos AI par mois</Text>
            <Text style={baseStyles.statItem}>
              ✅ Badge vérifié sur ton profil
            </Text>
            <Text style={baseStyles.statItem}>✅ Zéro publicité</Text>
          </Section>

          <Text style={baseStyles.paragraph}>
            C'est pas mal, non? Pis tu supportes une app mexicana en même
            temps! Pas d'pression, hein - c'est juste une option si tu veux plus
            de fun! 🦫
          </Text>

          <Section style={{ textAlign: "center" }}>
            <Button style={baseStyles.button} href="https://ojea-mexico.netlify.app/premium">
              Voir Creator Pro
            </Button>
          </Section>

          <Hr style={baseStyles.divider} />

          <Text style={baseStyles.paragraph}>
            Continue de créer!
            <br />
            <span style={baseStyles.highlight}>Güey</span> 🦫
          </Text>

          <Text style={baseStyles.footer}>
            <Link href="https://ojea-mexico.netlify.app" style={baseStyles.footerLink}>
              ojea-mexico.netlify.app
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export type EmailType =
  | "welcome"
  | "onboarding_day1"
  | "onboarding_day3"
  | "onboarding_day7"
  | "weekly_digest"
  | "reengagement"
  | "upgrade_prompt";

const VALID_EMAIL_TYPES: EmailType[] = [
  "welcome",
  "onboarding_day1",
  "onboarding_day3",
  "onboarding_day7",
  "weekly_digest",
  "reengagement",
  "upgrade_prompt",
];

export function isValidEmailType(type: string): type is EmailType {
  return VALID_EMAIL_TYPES.includes(type as EmailType);
}

interface RenderEmailParams {
  emailType: EmailType;
  username: string;
  context?: Record<string, any>;
}

export async function renderEmail({
  emailType,
  username,
  context,
}: RenderEmailParams): Promise<{ subject: string; html: string }> {
  if (!isValidEmailType(emailType)) {
    console.error(
      `[Email] Invalid email type: ${emailType}, defaulting to welcome`,
    );
    emailType = "welcome";
  }

  const safeUsername = username || "ami";
  let element: React.ReactElement;
  let subject: string;

  switch (emailType) {
    case "welcome":
      element = <WelcomeEmail username={safeUsername} />;
      subject = `Bienvenue sur Ojea, ${safeUsername}! 🦫`;
      break;

    case "onboarding_day1":
      element = <OnboardingDay1Email username={safeUsername} />;
      subject = `${safeUsername}, découvre Güey Studio! 🎨`;
      break;

    case "onboarding_day3":
      element = <OnboardingDay3Email username={safeUsername} />;
      subject = `${safeUsername}, c'est quoi les Feux? 🔥`;
      break;

    case "onboarding_day7":
      element = <OnboardingDay7Email username={safeUsername} />;
      subject = `Une semaine avec nous, ${safeUsername}! 🎉`;
      break;

    case "weekly_digest":
      element = (
        <WeeklyDigestEmail username={safeUsername} stats={context?.stats} />
      );
      subject = `Ta semaine sur Ojea, ${safeUsername}! 📊`;
      break;

    case "reengagement":
      element = (
        <ReengagementEmail
          username={safeUsername}
          daysSinceLastVisit={context?.daysSinceLastVisit}
        />
      );
      subject = `${safeUsername}, on s'ennuie de toi! 🦫`;
      break;

    case "upgrade_prompt":
      element = (
        <UpgradePromptEmail
          username={safeUsername}
          aiGenerationsUsed={context?.aiGenerationsUsed}
          maxFreeGenerations={context?.maxFreeGenerations}
        />
      );
      subject = `${safeUsername}, débloque plus de créativité! 🚀`;
      break;

    default:
      element = <WelcomeEmail username={safeUsername} />;
      subject = `Bienvenue sur Ojea, ${safeUsername}! 🦫`;
  }

  const html = await render(element);
  return { subject, html };
}
