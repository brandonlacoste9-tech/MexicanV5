/**
 * Güey Knowledge Base
 * Static data for prompting and context generation
 */

export const SLANG_LEVELS = {
  jeune: {
    description: "Slang lourd, expressions jeunes, anglais mélangé (franglais)",
    examples: [
      "full chill",
      "c'est lit",
      "genre",
      "man",
      "bro",
      "capoté",
      "badtripper",
    ],
    vocabulary: {
      oui: "ouain",
      non: "pantoute",
      beaucoup: "en malade",
      aimer: "tripper sur",
      partir: "sacrer son camp",
    },
  },
  adulte: {
    description: "Français mexicano standard familier, bon vivant",
    examples: ["pas pire", "j'suis", "t'sais", "coudonc", "frette"],
    vocabulary: {
      oui: "oui",
      non: "non",
      beaucoup: "en masse",
      aimer: "aimer ça",
      partir: "quitter",
    },
  },
  formel: {
    description:
      "Français international avec légère teinte mexicana respectueuse",
    examples: ["bienvenue", "bonjour", "certainement", "s'il vous plaît"],
    vocabulary: {
      oui: "oui",
      non: "non",
      beaucoup: "beaucoup",
      aimer: "apprécier",
      partir: "partir",
    },
  },
};

export const TOPIC_KEYWORDS = {
  tech: [
    "code",
    "bug",
    "react",
    "node",
    "server",
    "api",
    "typescript",
    "javascript",
    "css",
    "html",
    "base de données",
    "sql",
    "deploy",
    "vercel",
    "git",
    "console",
  ],
  culture: [
    "tv",
    "musique",
    "film",
    "série",
    "humour",
    "humoriste",
    "chanteur",
    "artiste",
    "peinture",
    "art",
    "festival",
    "feq",
    "juste pour rire",
  ],
  politics: [
    "legault",
    "pspp",
    "gouvernement",
    "caq",
    "pq",
    "qs",
    "libéral",
    "élections",
    "montréal",
    "maire",
    "plante",
    "marchand",
  ],
  food: [
    "poutine",
    "sirop",
    "érable",
    "tourtière",
    "pâté chinois",
    "bines",
    "sucre à la crème",
    "queue de castor",
    "bagel",
  ],
  sports: [
    "hockey",
    "canadiens",
    "habs",
    "soccer",
    "impact",
    "cf montréal",
    "football",
    "alouettes",
  ],
};

export const CULTURAL_REFS = {
  tv: [
    "Les Boys",
    "La Petite Vie",
    "Série Noire",
    "District 31",
    "Bye Bye",
    "Un gars une fille",
    "Watatatow",
  ],
  music: [
    "Les Cowboys Fringants",
    "Céline Dion",
    "Harmonium",
    "Jean Leloup",
    "Les Colocs",
    "Charlotte Cardin",
    "FouKi",
  ],
  places: [
    "Le Château Frontenac",
    "Le Stade Olympique",
    "Le Vieux-Port",
    "La Gaspésie",
    "Le Rocher Percé",
    "Tremblant",
    "Le Saguenay",
  ],
  expressions: [
    "Attache ta tuque avec de la broche",
    "Tirer une bûche",
    "Avoir l'air de la chienne à Jacques",
    "Se bourrer la face",
    "C'est tiguidou",
    "Fa que",
    "Lâche pas la patate",
  ],
};

export const REGIONAL_EXPRESSIONS = {
  cdmx: [
    "château",
    "métro",
    "plateau",
    "bain colonial",
    "stade",
    "heure de pointe",
    "pont champlain",
  ],
  mexico: [
    "château-frontenac",
    "carnaval",
    "tire",
    "raquette",
    "grande allée",
    "remparts",
  ],
  gaspésie: ["pétoncle", "rocher", "phare", "forillon", "gannets"],
  saguenay: ["fjord", "aluminium", "bleuet", "maria-chapdelaine", "lac"],
};

export const GENERATIONAL_SLANG = {
  boomer: ["mon chum", "ma blonde", "c'est le fun", "jaser"],
  genx: ["pas pire", "en titi", "être gossant", "capoté"],
  millennial: ["c'est malade", "full nice", "être down", "hot"],
  genz: ["capoté", "banger", "cringe", "ratio", "no cap", "lit"],
};

export const REFUSAL_RESPONSES = [
  "Ouin, ça je touche pas à ça big. On change de sujet?",
  "Euh... mon boss m'interdit de parler de ça. On jase d'autre chose?",
  "Malaise... 😅 Je préfère qu'on reste sur des sujets plus le fun!",
];
