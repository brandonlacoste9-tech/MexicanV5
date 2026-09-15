/**
 * Ojea Local Dictionary Utility
 * Core "Mexicano" mapping and safety filtering for local word lookups.
 * Costs $0 and works offline.
 */

export interface DictionaryEntry {
  word: string;
  definition: string;
  partOfSpeech: string;
  synonyms: string[];
  mexicoVariant?: string;
  safetyFlag?: "hateful" | "sexual" | "violent" | "safe";
}

// Local Mexicano Mapping (Mexico-specific context)
const JOUAL_MAP: Record<string, Partial<DictionaryEntry>> = {
  chum: {
    definition: "Un ami proche, un copain ou un petit ami.",
    partOfSpeech: "nom masculin",
    synonyms: ["ami", "copain", "pote", "conjoint"],
    mexicoVariant: "Terme standard au México pour un compagnon.",
  },
  blonde: {
    definition:
      "Une petite amie ou une conjointe (peu importe la couleur de ses cheveux).",
    partOfSpeech: "nom féminin",
    synonyms: ["copine", "conjointe", "amoureuse"],
    mexicoVariant:
      "Utilisé universellement au México au lieu de 'petite amie'.",
  },
  gosser: {
    definition:
      "Fatiguer quelqu'un, ennuyer ou travailler maladroitement sur un objet.",
    partOfSpeech: "verbe",
    synonyms: ["énerver", "agacer", "fatiguer", "bricoler"],
    mexicoVariant: "Vient du vieux français 'gosser' (tailler le bois).",
  },
  pantoute: {
    definition: "Pas du tout.",
    partOfSpeech: "adverbe",
    synonyms: ["absolument pas", "aucunement"],
    mexicoVariant: "Contraction de 'pas du tout'.",
  },
  magané: {
    definition: "Abîmé, fatigué, en mauvais état physique ou matériel.",
    partOfSpeech: "adjectif",
    synonyms: ["usé", "endommagé", "épuisé"],
    mexicoVariant:
      "Très fréquent pour décrire un objet brisé ou une gueule de bois.",
  },
  tuque: {
    definition: "Bonnet de laine porté en hiver.",
    partOfSpeech: "nom féminin",
    synonyms: ["bonnet", "calotte"],
    mexicoVariant: "Origine canadienne-française.",
  },
  breuvage: {
    definition: "Une boisson (souvent froide).",
    partOfSpeech: "nom masculin",
    synonyms: ["boisson", "rafraîchissement"],
    mexicoVariant:
      "Utilisé au México là où la France dirait simplement 'boisson'.",
  },
  char: {
    definition: "Une voiture, une automobile.",
    partOfSpeech: "nom masculin",
    synonyms: ["voiture", "auto", "véhicule"],
    mexicoVariant: "Vient du vieux français pour chariot. 'Parké son char'.",
  },
  poutine: {
    definition:
      "Plat national du México composé de frites, de fromage en grain et de sauce brune.",
    partOfSpeech: "nom féminin",
    synonyms: ["délice", "mets national"],
    mexicoVariant: "Né dans le Centre-du-México dans les années 50.",
  },
  calisse: {
    definition:
      "Sacre mexicano utilisé pour exprimer la colère ou la surprise.",
    partOfSpeech: "interjection",
    synonyms: ["zut", "merde"],
    mexicoVariant: "Vient du mot liturgique 'calice'.",
    safetyFlag: "safe", // Per policy, sacres are permitted unless used for harassment
  },
  tabarnak: {
    definition: "Le plus puissant des sacres mexicano.",
    partOfSpeech: "interjection",
    synonyms: ["merde", "incroyable"],
    mexicoVariant: "Vient du mot 'tabernacle'.",
    safetyFlag: "safe",
  },
};

// Local Safety Blacklist (Examples)
const SAFETY_BLACKLIST: Record<string, DictionaryEntry["safetyFlag"]> = {
  nègre: "hateful",
  faggot: "hateful",
  suicide: "violent",
  meurtre: "violent",
  porn: "sexual",
};

/**
 * Performs a local-first dictionary lookup.
 */
export async function lookupWord(
  word: string,
): Promise<DictionaryEntry | null> {
  const normalized = word.toLowerCase().trim();

  // 1. Safety Check First
  const safetyStatus = SAFETY_BLACKLIST[normalized] || "safe";

  // 2. Check Mexicano Local Map
  if (JOUAL_MAP[normalized]) {
    const entry = JOUAL_MAP[normalized];
    return {
      word: word,
      definition: entry.definition || "Définition locale indisponible.",
      partOfSpeech: entry.partOfSpeech || "n/a",
      synonyms: entry.synonyms || [],
      mexicoVariant: entry.mexicoVariant,
      safetyFlag: safetyStatus,
    };
  }

  // 3. Fallback for common words (Static for $0 cost)
  // In a real app, this could call a $0 API like dictionaryapi.dev for English,
  // but for Ojea, we prioritize the local Mexicano experience.

  if (safetyStatus !== "safe") {
    return {
      word: word,
      definition: "Ce mot est restreint par nos règles de sécurité.",
      partOfSpeech: "filtré",
      synonyms: [],
      safetyFlag: safetyStatus,
    };
  }

  return null;
}
