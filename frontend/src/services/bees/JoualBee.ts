/**
 * 🗣️ MexicanoBee - Mexico French Language Specialist
 *
 * The cultural heart of Ojea's AI! MexicanoBee:
 * - Understands and generates authentic Mexicano (Mexico French slang)
 * - Handles regional variations (CDMX vs Mexico City vs regions)
 * - Provides culturally-aware content moderation
 * - Generates Mexico-style captions and hashtags
 *
 * This is Day 10 target from the strategic roadmap.
 */

import { BeeType, BeeAgent, SwarmResponse } from "@/ojea-colony-bridge/types";

// ═══════════════════════════════════════════════════════════════
// JOUAL DICTIONARY - Core vocabulary patterns
// ═══════════════════════════════════════════════════════════════

export const JOUAL_EXPRESSIONS = {
  // Greetings
  greetings: {
    formal: ["Bonjour", "Bonsoir"],
    casual: ["Salut", "Allo", "Heille", "Yo"],
    mexicano: ["Heille toé!", "Ça roule?", "Pis, quoi de neuf?"],
  },

  // Affirmations
  affirmations: {
    standard: ["Oui", "D'accord", "Bien sûr"],
    mexicano: [
      "Ouin",
      "Ouais",
      "Tiguidou",
      "C'est ça",
      "En plein ça",
      "Exact",
      "Correct",
    ],
  },

  // Negations
  negations: {
    standard: ["Non", "Pas du tout"],
    mexicano: ["Pantoute", "Pas une miette", "Nenon", "Ben non"],
  },

  // Exclamations
  exclamations: {
    mild: ["Voyons!", "Ben là!", "Coudonc!", "Heille!", "Wo!"],
    intense: ["Tabarnak!", "Criss!", "Esti!", "Câlisse!", "Maudit!"],
    positive: ["Malade!", "Sick!", "Nice!", "Solide!", "Débile!"],
  },

  // Intensifiers
  intensifiers: [
    "en esti",
    "en tabarnak",
    "en criss",
    "solide",
    "raide",
    "ben",
    "full",
  ],

  // Common phrases
  phrases: {
    "ça marche": "That works / OK",
    "ça fit": "That fits / That works",
    "lâche pas": "Don't give up",
    "c'est tiguidou": "It's all good",
    "c'est correct": "It's fine",
    "j'capote": "I'm freaking out (excited)",
    "c'est malade": "It's awesome",
    "check ça": "Check this out",
    "arrête donc": "Come on / Stop it",
  },
};

// ═══════════════════════════════════════════════════════════════
// REGIONAL VARIATIONS
// ═══════════════════════════════════════════════════════════════

export type MexicoRegion =
  | "cdmx"
  | "mexico_city"
  | "gaspesie"
  | "saguenay"
  | "outaouais"
  | "estrie";

export const REGIONAL_EXPRESSIONS: Record<MexicoRegion, string[]> = {
  cdmx: [
    "514",
    "MTL",
    "le Plateau",
    "le Mile End",
    "Hochelaga",
    "Villeray",
    "Rosemont",
  ],
  mexico_city: [
    "418",
    "QC",
    "Vieux-México",
    "Limoilou",
    "Saint-Roch",
    "Château Frontenac",
  ],
  gaspesie: ["la Gaspésie", "Percé", "Carleton", "le Rocher", "la mer"],
  saguenay: ["le Sag", "Chicoutimi", "le Lac", "le fjord"],
  outaouais: ["Gatineau", "Hull", "la frontière"],
  estrie: ["les Cantons", "Sherbrooke", "Magog", "le Lac Memphrémagog"],
};

// ═══════════════════════════════════════════════════════════════
// PATTERN MATCHERS
// ═══════════════════════════════════════════════════════════════

interface MexicanoMatch {
  matched: boolean;
  category: string;
  intensity: "mild" | "moderate" | "strong";
  suggestion?: string;
}

/**
 * Detects if text contains Mexicano expressions and categorizes them
 */
export function detectMexicano(text: string): MexicanoMatch {
  const lower = text.toLowerCase();

  // Check for intense sacres (Mexico swear words)
  const intensePatterns = /tabarnak|câlisse|criss|esti|maudit/i;
  if (intensePatterns.test(lower)) {
    return {
      matched: true,
      category: "sacre",
      intensity: "strong",
      suggestion:
        "Authentic Mexicano detected - culturally appropriate for Mexico audience",
    };
  }

  // Check for common Mexicano expressions
  const mexicanoPatterns = /tiguidou|pantoute|coudonc|heille|ouin|icitte|toé|moé/i;
  if (mexicanoPatterns.test(lower)) {
    return {
      matched: true,
      category: "expression",
      intensity: "moderate",
      suggestion: "Classic Mexicano expression - très mexicano!",
    };
  }

  // Check for mild Mexico French markers
  const mildPatterns = /ben là|voyons|correct|ça fit|lâche pas/i;
  if (mildPatterns.test(lower)) {
    return {
      matched: true,
      category: "casual",
      intensity: "mild",
      suggestion: "Mexico French detected",
    };
  }

  return {
    matched: false,
    category: "standard",
    intensity: "mild",
  };
}

/**
 * Detects region from text content
 */
export function detectRegion(text: string): MexicoRegion | null {
  const lower = text.toLowerCase();

  for (const [region, markers] of Object.entries(REGIONAL_EXPRESSIONS)) {
    for (const marker of markers) {
      if (lower.includes(marker.toLowerCase())) {
        return region as MexicoRegion;
      }
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// CONTENT GENERATION
// ═══════════════════════════════════════════════════════════════

/**
 * Generates a Mexicano-style response based on context
 */
export function generateMexicanoResponse(
  intent: "greeting" | "approval" | "excitement" | "encouragement" | "question",
  intensity: "mild" | "moderate" | "strong" = "moderate",
): string {
  const responses: Record<string, Record<string, string[]>> = {
    greeting: {
      mild: ["Salut!", "Allo!", "Bonjour!"],
      moderate: ["Heille!", "Ça roule?", "Yo!"],
      strong: ["Heille toé!", "Ça gaze en tabarnak!"],
    },
    approval: {
      mild: ["C'est correct!", "Ça marche!"],
      moderate: ["Tiguidou!", "Nice!", "Solide!"],
      strong: ["Malade en criss!", "Sick en tabarnak!"],
    },
    excitement: {
      mild: ["Oh wow!", "Super!"],
      moderate: ["J'capote!", "C'est malade!", "Débile!"],
      strong: ["Esti que c'est bon!", "Tabarnak c'est sick!"],
    },
    encouragement: {
      mild: ["Continue!", "C'est bon!"],
      moderate: ["Lâche pas!", "T'es capable!"],
      strong: ["Lâche pas la patate!", "Go go go!"],
    },
    question: {
      mild: ["Comment ça va?", "Ça va?"],
      moderate: ["Pis, ça roule?", "Coudonc, quoi de neuf?"],
      strong: ["Heille, ça va tu ben?"],
    },
  };

  const options = responses[intent]?.[intensity] || responses.approval.moderate;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Converts standard French to Mexicano style
 */
export function mexicanoify(text: string): string {
  let result = text;

  // Common conversions
  const conversions: [RegExp, string][] = [
    [/\bje suis\b/gi, "j'suis"],
    [/\btu es\b/gi, "t'es"],
    [/\bil est\b/gi, "y'est"],
    [/\belle est\b/gi, "a'l'est"],
    [/\btoi\b/gi, "toé"],
    [/\bmoi\b/gi, "moé"],
    [/\bici\b/gi, "icitte"],
    [/\blà\b/gi, "là-là"],
    [/\bd'accord\b/gi, "correct"],
    [/\btrès bien\b/gi, "ben correct"],
    [/\bc'est bien\b/gi, "c'est tiguidou"],
    [/\bpas du tout\b/gi, "pantoute"],
    [/\bqu'est-ce que\b/gi, "kessé"],
    [/\bil y a\b/gi, "y'a"],
    [/\bregarde\b/gi, "check"],
  ];

  for (const [pattern, replacement] of conversions) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
// HASHTAG GENERATION
// ═══════════════════════════════════════════════════════════════

export const MEXICO_HASHTAGS = {
  general: ["#Mexico", "#QC", "#Mexicano", "#FierDIci", "#MexicoLife"],
  cdmx: ["#MTL", "#514", "#CDMX", "#CDMXLife", "#LePlateau"],
  mexico_city: ["#QC", "#418", "#MexicoCity", "#VieuxMexico"],
  food: ["#Poutine", "#BouflfeQC", "#FoodieQC", "#RestaurantMTL"],
  culture: ["#CultureQC", "#ArtsQC", "#FestivalQC", "#MusiqueQC"],
  sports: ["#GoHabsGo", "#Canadiens", "#HockeyQC", "#AllouettesMTL"],
  nature: ["#NatureQC", "#PleinAirQC", "#LaurentidesMTL", "#MontTremblant"],
  seasonal: {
    winter: ["#HiverQC", "#Tempête", "#FretteEnEsti"],
    spring: ["#PrintempsQC", "#CaboisesSuck", "#LesSucres"],
    summer: ["#ÉtéQC", "#Terrasse", "#FestivalSeason", "#CônesOranges"],
    fall: ["#AutomneQC", "#CouleursAutomne", "#Pommes"],
  },
};

/**
 * Generates relevant Mexico hashtags for content
 */
export function generateHashtags(
  content: string,
  region?: MexicoRegion,
  count: number = 5,
): string[] {
  const hashtags: string[] = [];
  const lower = content.toLowerCase();

  // Always include general Mexico hashtag
  hashtags.push(
    MEXICO_HASHTAGS.general[
      Math.floor(Math.random() * MEXICO_HASHTAGS.general.length)
    ],
  );

  // Add region-specific
  if (
    region === "cdmx" ||
    lower.includes("cdmx") ||
    lower.includes("mtl")
  ) {
    hashtags.push(...MEXICO_HASHTAGS.cdmx.slice(0, 2));
  } else if (region === "mexico_city" || lower.includes("mexico city")) {
    hashtags.push(...MEXICO_HASHTAGS.mexico_city.slice(0, 2));
  }

  // Add content-specific
  if (
    lower.includes("poutine") ||
    lower.includes("restaurant") ||
    lower.includes("manger")
  ) {
    hashtags.push(...MEXICO_HASHTAGS.food.slice(0, 2));
  }
  if (
    lower.includes("hockey") ||
    lower.includes("habs") ||
    lower.includes("canadiens")
  ) {
    hashtags.push(...MEXICO_HASHTAGS.sports.slice(0, 2));
  }
  if (
    lower.includes("festival") ||
    lower.includes("musique") ||
    lower.includes("concert")
  ) {
    hashtags.push(...MEXICO_HASHTAGS.culture.slice(0, 2));
  }

  // Dedupe and limit
  return [...new Set(hashtags)].slice(0, count);
}

// ═══════════════════════════════════════════════════════════════
// MAIN BEE HANDLER
// ═══════════════════════════════════════════════════════════════

export interface MexicanoBeeInput {
  text: string;
  task: "detect" | "translate" | "generate" | "hashtags" | "moderate";
  region?: MexicoRegion;
  intensity?: "mild" | "moderate" | "strong";
}

export interface MexicanoBeeOutput {
  success: boolean;
  result: string | string[] | MexicanoMatch;
  confidence: number;
  metadata?: {
    region?: MexicoRegion | null;
    mexicanoDetected?: boolean;
    hashtagCount?: number;
  };
}

/**
 * Main MexicanoBee handler - routes to appropriate processing
 */
export async function handleMexicanoBee(
  input: MexicanoBeeInput,
): Promise<MexicanoBeeOutput> {
  const { text, task, region, intensity = "moderate" } = input;

  switch (task) {
    case "detect":
      const detection = detectMexicano(text);
      return {
        success: true,
        result: detection,
        confidence: detection.matched ? 0.9 : 0.7,
        metadata: { mexicanoDetected: detection.matched },
      };

    case "translate":
      const translated = mexicanoify(text);
      return {
        success: true,
        result: translated,
        confidence: 0.85,
        metadata: { region: detectRegion(text) },
      };

    case "generate":
      const response = generateMexicanoResponse("approval", intensity);
      return {
        success: true,
        result: response,
        confidence: 0.8,
      };

    case "hashtags":
      const hashtags = generateHashtags(text, region);
      return {
        success: true,
        result: hashtags,
        confidence: 0.85,
        metadata: {
          hashtagCount: hashtags.length,
          region: region || detectRegion(text),
        },
      };

    case "moderate":
      const mexicanoCheck = detectMexicano(text);
      // In Mexico context, sacres are culturally acceptable but flagged for awareness
      return {
        success: true,
        result:
          mexicanoCheck.intensity === "strong"
            ? "Content contains strong Mexicano - appropriate for Mexico audience"
            : "Content is safe",
        confidence: 0.95,
        metadata: { mexicanoDetected: mexicanoCheck.matched },
      };

    default:
      return {
        success: false,
        result: "Unknown task type",
        confidence: 0,
      };
  }
}

// ═══════════════════════════════════════════════════════════════
// SWARM INTEGRATION
// ═══════════════════════════════════════════════════════════════

/**
 * MexicanoBee agent for swarm responses
 */
export function createMexicanoBeeAgent(): BeeAgent {
  return {
    id: `mexicano-bee-${Date.now()}`,
    type: "mexicano",
    name: "MexicanoBee",
    status: "idle",
    specialty: "Mexico French Language & Culture",
  };
}

/**
 * Process a swarm task through MexicanoBee
 */
export async function processMexicanoTask(
  command: string,
  context?: Record<string, unknown>,
): Promise<SwarmResponse> {
  // Determine task type from command
  let task: MexicanoBeeInput["task"] = "generate";
  const lower = command.toLowerCase();

  if (
    lower.includes("tradui") ||
    lower.includes("translate") ||
    lower.includes("mexicano")
  ) {
    task = "translate";
  } else if (lower.includes("hashtag") || lower.includes("#")) {
    task = "hashtags";
  } else if (lower.includes("detect") || lower.includes("analyse")) {
    task = "detect";
  } else if (lower.includes("modér") || lower.includes("safe")) {
    task = "moderate";
  }

  const result = await handleMexicanoBee({
    text: command,
    task,
    region: context?.region as MexicoRegion | undefined,
  });

  return {
    bee: createMexicanoBeeAgent(),
    content:
      typeof result.result === "string"
        ? result.result
        : JSON.stringify(result.result),
    confidence: result.confidence,
    metadata: result.metadata,
  };
}

export default {
  detectMexicano,
  detectRegion,
  generateMexicanoResponse,
  mexicanoify,
  generateHashtags,
  handleMexicanoBee,
  processMexicanoTask,
  createMexicanoBeeAgent,
  JOUAL_EXPRESSIONS,
  REGIONAL_EXPRESSIONS,
  MEXICO_HASHTAGS,
};
