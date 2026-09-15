/**
 * Ojea Factory - Application Configuration Schema
 * This file defines the identity of a specific app clone.
 */
import { region } from "./region";

export interface AppTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBackground: string;
  textMain: string;
  textMuted: string;
  edgeLighting: string;
  glowColor: string;
  stitchingColor: string;
  fontFamily: string;
}

export interface AppIdentity {
  hiveId: string; // The backend hive identifier (matching hiveEnum in schema.ts)
  name: string;
  tagline: string;
  region: string;
  locale: string;
  iconEmoji: string;
  giftEmoji: string; // The primary currency/gift icon (Leaf, Mate, Taco)
  landingTitle: string;
  landingSubtitle: string;
  onboardingSteps: Array<{
    title: string;
    description: string;
    image?: string;
  }>;
}

export interface AppConfig {
  identity: AppIdentity;
  theme: AppTheme;
  features: {
    enableChat: boolean;
    enableStories: boolean;
    enableModeration: boolean;
    enableGifts: boolean;
  };
}

// 1. Ojea México (The Original)
const MEXICO_CONFIG: AppConfig = {
  identity: {
    hiveId: region.hive,
    name: region.brand,
    tagline: region.tagline,
    region: region.country,
    locale: region.locale,
    iconEmoji: "MX",
    giftEmoji: "MXN",
    landingTitle: "Bienvenido a Ojea",
    landingSubtitle: region.tagline,
    onboardingSteps: [
      {
        title: "Descubre",
        description: "Videos de México: CDMX, Guadalajara, Monterrey y más.",
      },
      { title: "Conecta", description: "Sigue, comenta y manda mensajes." },
      { title: "Publica", description: "Sube un clip al feed de Ojea." },
    ],
  },
  theme: {
    primary: "#FFBF00", // Gold
    secondary: "#1a1512", // Dark Leather
    accent: "#FFD966", // Gold Accent
    background: "#0d0c0b", // Dark Leather Background
    cardBackground: "#241d19", // Leather Card
    textMain: "#FFFFFF",
    textMuted: "#a18e87", // Muted Leather
    edgeLighting: "#FFBF00", // Gold Edge
    glowColor: "rgba(255, 191, 0, 0.1)", // Toned down Gold Glow
    stitchingColor: "rgba(218, 165, 32, 0.3)", // Subtle Gold Stitching
    fontFamily: "'Inter', sans-serif",
  },
  features: {
    enableChat: true,
    enableStories: true,
    enableModeration: true,
    enableGifts: true,
  },
};

// 2. Conexão (Brazil Pilot)
const BRAZIL_CONFIG: AppConfig = {
  identity: {
    hiveId: "brazil",
    name: "Conexão",
    tagline: "O Swarm Brasileiro 🇧🇷",
    region: "BR",
    locale: "pt-BR",
    iconEmoji: "🇧🇷",
    giftEmoji: "🌴",
    landingTitle: "Bem-vindo à Conexão",
    landingSubtitle: "A plataforma social premium do Brasil.",
    onboardingSteps: [
      {
        title: "Descubra",
        description: "Vídeos exclusivos e talentos locais.",
      },
      { title: "Conecte-se", description: "Troque ideias com a comunidade." },
      { title: "Ganhe", description: "Receba presentes dos seus fãs." },
    ],
  },
  theme: {
    primary: "#FFBF00", // Gold
    secondary: "#1a1512",
    accent: "#FFD966",
    background: "#0d0c0b",
    cardBackground: "#241d19",
    textMain: "#FFFFFF",
    textMuted: "#a18e87",
    edgeLighting: "#FFBF00",
    glowColor: "rgba(255, 191, 0, 0.4)",
    stitchingColor: "rgba(218, 165, 32, 0.7)",
    fontFamily: "'Inter', sans-serif",
  },
  features: {
    enableChat: true,
    enableStories: true,
    enableModeration: true,
    enableGifts: true,
  },
};

// 3. Zarpado (Argentina Pilot)
const ARGENTINA_CONFIG: AppConfig = {
  identity: {
    hiveId: "argentina",
    name: "Zarpado",
    tagline: "El Swarm Argentino 🇦🇷",
    region: "AR",
    locale: "es-AR",
    iconEmoji: "🇦🇷",
    giftEmoji: "🧉",
    landingTitle: "Bienvenido a Zarpado",
    landingSubtitle: "La plataforma social más picante de Argentina.",
    onboardingSteps: [
      { title: "Descubrí", description: "Videos exclusivos y talento local." },
      { title: "Conectá", description: "Hablá con la comunidad." },
      { title: "Ganá", description: "Recibí regalos de tus fans." },
    ],
  },
  theme: {
    primary: "#75AADB", // Sky Blue
    secondary: "#1a1512",
    accent: "#FFFFFF",
    background: "#0d0c0b",
    cardBackground: "#1e1e1e",
    textMain: "#FFFFFF",
    textMuted: "#a18e87",
    edgeLighting: "#75AADB",
    glowColor: "rgba(117, 170, 219, 0.4)",
    stitchingColor: "rgba(255, 255, 255, 0.5)",
    fontFamily: "'Inter', sans-serif",
  },
  features: {
    enableChat: true,
    enableStories: true,
    enableModeration: true,
    enableGifts: true,
  },
};

// DOMAIN-BASED CONFIG DETECTION — this fork is the Mexico pack
const detectConfig = (): AppConfig => {
  return MEXICO_CONFIG;
};

export const AppConfig = detectConfig();
