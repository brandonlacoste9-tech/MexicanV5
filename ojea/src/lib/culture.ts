import { seedClipVideoUrl } from "./media";

export const SERIES = [
  "MexicoIn30s",
  "SpainIn30s",
  "SlangPack",
  "FestivalFiles",
  "FoodLab",
  "HistorySnack",
  "DailyLife",
  "MythsVsFacts",
  "RegionalSpotlight",
  "Challenges",
] as const;

export type SeriesId = (typeof SERIES)[number];
export type ClipCountry = "MX" | "ES" | "BOTH";

export const SERIES_LABEL: Record<SeriesId, { es: string; en: string }> = {
  MexicoIn30s: { es: "México en 30s", en: "Mexico in 30s" },
  SpainIn30s: { es: "España en 30s", en: "Spain in 30s" },
  SlangPack: { es: "Slang", en: "Slang" },
  FestivalFiles: { es: "Festivales", en: "Festivals" },
  FoodLab: { es: "Comida", en: "Food" },
  HistorySnack: { es: "Historia", en: "History" },
  DailyLife: { es: "Vida", en: "Daily life" },
  MythsVsFacts: { es: "Mitos", en: "Myths" },
  RegionalSpotlight: { es: "Regiones", en: "Regions" },
  Challenges: { es: "Retos", en: "Challenges" },
};

export type CultureClip = {
  id: string;
  user: string;
  displayName: string;
  caption: string;
  city: string;
  image: string;
  video?: string;
  likes: number;
  comments: { user: string; text: string }[];
  tags: string[];
  sound: string;
  soundArtist: string;
  series: SeriesId;
  country: ClipCountry;
};

function media(fileId: string) {
  return {
    image: `/clips/${fileId}.jpg`,
    video: seedClipVideoUrl(fileId),
  };
}

function clip(
  id: string,
  fileId: string,
  title: string,
  series: SeriesId,
  country: ClipCountry,
  caption: string,
  tags: string[],
  city: string,
): CultureClip {
  return {
    id,
    user: "otealo",
    displayName: "Otealo",
    caption,
    city,
    ...media(fileId),
    likes: 0,
    comments: [],
    tags,
    sound: title,
    soundArtist: "Otealo",
    series,
    country,
  };
}

export const CALENDAR_CLIPS: CultureClip[] = [
  clip("d01", "mariachi", "México y España en 30s", "MexicoIn30s", "BOTH",
    "Bienvenidos. Clips cortos de cultura mexicana — y España si la buscas.",
    ["#MexicoIn30s", "parati"], "Ciudad de México"),
  clip("d02", "tapas", "Tacos contra tapas", "FoodLab", "BOTH",
    "Comida de calle: tacos en México, tapas en España. ¿De qué lado estás?",
    ["#FoodLab", "parati"], "Madrid"),
  clip("d03", "reforma", "Tres palabras de México", "SlangPack", "MX",
    "Suena como local: ¿qué onda?, chido, órale.",
    ["#SlangPack", "parati"], "Ciudad de México"),
  clip("d04", "madrid", "Tres palabras de España", "SlangPack", "ES",
    "Suena como local en España: tío, vale, guay.",
    ["#SlangPack", "parati"], "Madrid"),
  clip("d05", "ofrenda", "Día de Muertos en 30s", "FestivalFiles", "MX",
    "No es el Halloween mexicano. Ofrenda, cempasúchil, memoria.",
    ["#FestivalFiles", "parati"], "Michoacán"),
  clip("d06", "tomatina", "La Tomatina", "FestivalFiles", "ES",
    "Un pueblo que lanza 150 toneladas de tomate. Buñol, España.",
    ["#FestivalFiles", "parati"], "Buñol"),
  clip("d07", "flamenco", "Mariachi contra flamenco", "MexicoIn30s", "BOTH",
    "Batalla de emoción: trompeta contra guitarra. ¿Cuál pega más?",
    ["#Mariachi", "#Flamenco", "parati"], "Sevilla"),
  clip("d08", "guacamole", "Guacamole de verdad", "FoodLab", "MX",
    "Aguacate, limón, sal, cebolla, cilantro. Sin mayonesa.",
    ["#FoodLab", "parati"], "Ciudad de México"),
  clip("d09", "tortilla", "Tortilla española: el giro", "FoodLab", "ES",
    "Huevo y papa. El reto es voltearla entera. ¿Con cebolla?",
    ["#FoodLab", "parati"], "Madrid"),
  clip("d10", "mercado2", "El mercado mexicano", "DailyLife", "MX",
    "Aquí compran de verdad: chiles, hierbas, regateo y color.",
    ["#DailyLife", "parati"], "Oaxaca"),
  clip("d11", "madrid", "Por qué se cena a las 10", "DailyLife", "ES",
    "En España la cena llega tarde. La siesta diaria es mito.",
    ["#DailyLife", "parati"], "Madrid"),
  clip("d12", "piramidesol", "¿Quién hizo Teotihuacan?", "HistorySnack", "MX",
    "No la construyeron los mexicas. Pirámides del Sol y la Luna. Autores desconocidos.",
    ["#HistorySnack", "parati"], "Estado de México"),
  clip("d13", "alhambra", "La Alhambra en 30s", "HistorySnack", "ES",
    "Un palacio que parece un sueño. Granada, yeso y jardines.",
    ["#HistorySnack", "parati"], "Granada"),
  clip("d14", "chapu", "Domingo en familia", "DailyLife", "BOTH",
    "Misma vibra, distinto menú. La mesa llena es la costumbre.",
    ["#DailyLife", "parati"], "Ciudad de México"),
  clip("d15", "mezcal", "Oaxaca y el mole", "RegionalSpotlight", "MX",
    "Un estado, docenas de salsas. Mole negro, mercado, artesanía.",
    ["#RegionalSpotlight", "parati"], "Oaxaca"),
  clip("d16", "andalucia", "Andalucía", "RegionalSpotlight", "ES",
    "El sur: Sevilla, pueblos blancos, flamenco.",
    ["#RegionalSpotlight", "parati"], "Sevilla"),
  clip("d17", "metro", "La misma palabra, otro país", "SlangPack", "BOTH",
    "No te confundas: coger no significa lo mismo en México y en España.",
    ["#SlangPack", "parati"], "Ciudad de México"),
  clip("d18", "retablo", "Semana Santa", "FestivalFiles", "BOTH",
    "Misma semana, otro estilo. Procesión, flor y silencio.",
    ["#FestivalFiles", "parati"], "Sevilla"),
  clip("d19", "sevillanas", "Ocho tiempos de sevillanas", "SpainIn30s", "ES",
    "Baila como si estuvieras en la Feria.",
    ["#Dance", "parati"], "Sevilla"),
  clip("d20", "folklor", "Un paso de jarabe tapatío", "MexicoIn30s", "MX",
    "Aprende un paso del jarabe tapatío. El sombrero va al final.",
    ["#Dance", "parati"], "Guadalajara"),
  clip("d21", "elote", "Elote de la calle", "FoodLab", "MX",
    "Maíz, pero icónico: mayo, queso, chile, limón.",
    ["#FoodLab", "parati"], "Ciudad de México"),
  clip("d22", "reforma", "La CDMX en 30s", "MexicoIn30s", "MX",
    "No solo playas y pirámides. Metro, murales, parques, noche.",
    ["#MexicoIn30s", "parati"], "Ciudad de México"),
  clip("d23", "sagrada", "Madrid o Barcelona", "SpainIn30s", "ES",
    "Capital contra Mediterráneo. ¿De qué lado?",
    ["#SpainIn30s", "parati"], "Barcelona"),
  clip("d24", "zocalo2", "Tres mitos de México", "MythsVsFacts", "MX",
    "No: sombrero todos los días, todo picante, solo playas.",
    ["#MythsVsFacts", "parati"], "Ciudad de México"),
  clip("d25", "madrid", "Tres mitos de España", "MythsVsFacts", "ES",
    "No: siesta todos los días, todo flamenco, solo paella.",
    ["#MythsVsFacts", "parati"], "Madrid"),
  clip("d26", "mariachi", "Enséñanos una palabra", "Challenges", "BOTH",
    "Una palabra de tu región. Slang o dicho. La publicamos.",
    ["#Challenges", "parati"], "Ciudad de México"),
  clip("d27", "templomayor", "Templo Mayor bajo la ciudad", "HistorySnack", "MX",
    "Templo antiguo bajo la ciudad moderna. Templo Mayor, Zócalo.",
    ["#HistorySnack", "parati"], "Ciudad de México"),
  clip("d28", "caminoes", "Camino de Santiago", "HistorySnack", "ES",
    "Caminan cientos de kilómetros. Concha, polvo, catedral.",
    ["#HistorySnack", "parati"], "Santiago de Compostela"),
  clip("d29", "churroes", "Churros con chocolate", "FoodLab", "ES",
    "El antojo de noche en España. Chocolate espeso.",
    ["#FoodLab", "parati"], "Madrid"),
  clip("d30", "flamenco", "30 días de cultura", "MexicoIn30s", "BOTH",
    "Comida, baile, fiesta, historia. ¿Qué serie quieres después?",
    ["#MexicoIn30s", "parati"], "Ciudad de México"),
];

export function inferCountry(clip?: { country?: ClipCountry } | null): ClipCountry {
  if (!clip) return "MX";
  if (clip.country) return clip.country;
  return "MX";
}

export function inferSeries(clip?: { series?: SeriesId; tags?: string[] } | null): SeriesId {
  if (!clip) return "MexicoIn30s";
  if (clip.series) return clip.series;
  const tags = (clip.tags ?? []).map((t) => t.toLowerCase().replace("#", ""));
  if (tags.some((t) => ["maya", "azteca", "mexica", "piramide", "olmeca", "teotihuacan"].includes(t)))
    return "HistorySnack";
  if (tags.some((t) => ["tacos", "elote", "comida", "cacao", "churros"].includes(t)))
    return "FoodLab";
  if (tags.some((t) => ["muertos", "fiesta", "mariachi", "independencia", "grito"].includes(t))) return "FestivalFiles";
  return "MexicoIn30s";
}

export function matchesCulture(
  clip: { series?: SeriesId; country?: ClipCountry; tags: string[] },
  country: "ALL" | ClipCountry,
  series: "ALL" | SeriesId,
) {
  const c = inferCountry(clip);
  const s = inferSeries(clip);
  if (c !== "MX" || s === "SpainIn30s") return false;
  if (series !== "ALL" && s !== series) return false;
  return true;
}
