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
    caption: `${title}\n${caption}`,
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
  clip("d01", "mariachi", "Welcome to MX|ES: Mexico + Spain in 30s", "MexicoIn30s", "BOTH",
    "Bienvenidos / Welcome: cultura de México y España cada día.",
    ["#MexicoIn30s", "#SpainIn30s", "parati"], "Ciudad de México"),
  clip("d02", "tapas", "Tacos vs Tapas", "FoodLab", "BOTH",
    "Comida callejera: México vs España. Street food battle: tacos vs tapas. ¿Cuál prefieres?",
    ["#FoodLab", "#TacosVsTapas", "parati"], "Madrid"),
  clip("d03", "reforma", "3 Mexican slang words you need", "SlangPack", "MX",
    "Suena como local: ¿qué onda?, chido, órale. Sound like a local in Mexico.",
    ["#SlangPack", "#MexicanSpanish", "parati"], "Ciudad de México"),
  clip("d04", "madrid", "3 Spanish slang words you need", "SlangPack", "ES",
    "Suena como local en España: tío/tía, vale, guay.",
    ["#SlangPack", "#SpanishFromSpain", "parati"], "Madrid"),
  clip("d05", "ofrenda", "Día de los Muertos in 30 seconds", "FestivalFiles", "MX",
    "No es Halloween mexicano. Ofrendas, cempasúchil, calaveras, honor y memoria.",
    ["#FestivalFiles", "#DiaDeLosMuertos", "parati"], "Michoacán"),
  clip("d06", "tomatina", "La Tomatina", "FestivalFiles", "ES",
    "Un pueblo que lanza 150 toneladas de tomates. Buñol, España.",
    ["#FestivalFiles", "#LaTomatina", "parati"], "Buñol"),
  clip("d07", "flamenco", "Mariachi vs Flamenco", "MexicoIn30s", "BOTH",
    "Batalla de emoción: mariachi vs flamenco. Which hits harder?",
    ["#Mariachi", "#Flamenco", "parati"], "Sevilla"),
  clip("d08", "guacamole", "Real guacamole in 20 seconds", "FoodLab", "MX",
    "Deja de arruinar el guacamole: aguacate, limón, sal, cebolla, cilantro. Sin mayo.",
    ["#FoodLab", "#Guacamole", "parati"], "Ciudad de México"),
  clip("d09", "tortilla", "Spanish tortilla: the flip", "FoodLab", "ES",
    "Tortilla española: el reto del giro. Eggs + potato. ¿Cebolla?",
    ["#FoodLab", "#TortillaEspañola", "parati"], "Madrid"),
  clip("d10", "mercado2", "Mexican mercado in 30 seconds", "DailyLife", "MX",
    "Aquí es donde realmente compran. Colores, chiles, hierbas, regateo.",
    ["#DailyLife", "#Mercado", "parati"], "Oaxaca"),
  clip("d11", "madrid", "Why dinner is at 10 p.m.", "DailyLife", "ES",
    "¿Por qué se cena tan tarde? Trabajo, comida, siesta (mito), cena tarde.",
    ["#DailyLife", "#Spain", "parati"], "Madrid"),
  clip("d12", "piramidesol", "Who built Teotihuacan?", "HistorySnack", "MX",
    "No, los aztecas no construyeron esto. Pirámides del Sol y la Luna. Constructores desconocidos.",
    ["#HistorySnack", "#Teotihuacan", "parati"], "Estado de México"),
  clip("d13", "alhambra", "Alhambra in 30 seconds", "HistorySnack", "ES",
    "Un palacio que parece un sueño. Granada, arte islámico, jardines.",
    ["#HistorySnack", "#Alhambra", "parati"], "Granada"),
  clip("d14", "chapu", "Family Sunday: Mexico vs Spain", "DailyLife", "BOTH",
    "Misma vibra, diferente menú. Same vibe, different menu.",
    ["#DailyLife", "#Family", "parati"], "Ciudad de México"),
  clip("d15", "mezcal", "Oaxaca: land of moles", "RegionalSpotlight", "MX",
    "Un estado, docenas de salsas. Mole negro, mercados, artesanías.",
    ["#RegionalSpotlight", "#Oaxaca", "parati"], "Oaxaca"),
  clip("d16", "andalucia", "Andalusia: flamenco and white villages", "RegionalSpotlight", "ES",
    "El alma del sur: Sevilla, Jerez, pueblos blancos, flamenco.",
    ["#RegionalSpotlight", "#Andalucia", "parati"], "Sevilla"),
  clip("d17", "metro", "Words that mean different things", "SlangPack", "BOTH",
    "No te confundas: coger, platicar/hablar. MX vs ES.",
    ["#SlangPack", "#Spanish", "parati"], "Ciudad de México"),
  clip("d18", "retablo", "Semana Santa: Mexico vs Spain", "FestivalFiles", "BOTH",
    "Misma semana, diferente estilo. Procesiones, penitentes, emoción.",
    ["#FestivalFiles", "#SemanaSanta", "parati"], "Sevilla"),
  clip("d19", "sevillanas", "Learn 8 counts of sevillanas", "SpainIn30s", "ES",
    "Baila como si estuvieras en la Feria. 8 counts of sevillanas.",
    ["#Dance", "#Sevillanas", "parati"], "Sevilla"),
  clip("d20", "folklor", "Try this jarabe tapatío step", "MexicoIn30s", "MX",
    "Aprende un paso del Jarabe Tapatío. Learn one step from the Mexican Hat Dance.",
    ["#Dance", "#JarabeTapatio", "parati"], "Guadalajara"),
  clip("d21", "elote", "Street elote: Mexican corn", "FoodLab", "MX",
    "Maíz, pero icónico. Elote con mayo, queso, chile, limón.",
    ["#FoodLab", "#Elote", "parati"], "Ciudad de México"),
  clip("d22", "reforma", "Mexico City in 30 seconds", "MexicoIn30s", "MX",
    "No solo playas y pirámides. CDMX: metro, murales, parques, noche.",
    ["#MexicoIn30s", "#CDMX", "parati"], "Ciudad de México"),
  clip("d23", "sagrada", "Madrid vs Barcelona", "SpainIn30s", "ES",
    "¿Team Madrid o Team Barcelona? Capital vs Mediterráneo.",
    ["#SpainIn30s", "#Madrid", "#Barcelona", "parati"], "Barcelona"),
  clip("d24", "zocalo2", "3 myths about Mexican culture", "MythsVsFacts", "MX",
    "Deja de creer esto: sombrero todos los días, todo picante, solo playas.",
    ["#MythsVsFacts", "#Mexico", "parati"], "Ciudad de México"),
  clip("d25", "madrid", "3 myths about Spanish culture", "MythsVsFacts", "ES",
    "También hay mitos: siesta todos los días, todo flamenco, solo paella.",
    ["#MythsVsFacts", "#Spain", "parati"], "Madrid"),
  clip("d26", "mariachi", "Teach us ONE word from your region", "Challenges", "BOTH",
    "Enséñanos UNA palabra de tu región. Slang o expresión local.",
    ["#Challenges", "#Spanish", "parati"], "Ciudad de México"),
  clip("d27", "templomayor", "Templo Mayor: under Mexico City", "HistorySnack", "MX",
    "Templo antiguo bajo una ciudad moderna. Templo Mayor, Zócalo.",
    ["#HistorySnack", "#TemploMayor", "parati"], "Ciudad de México"),
  clip("d28", "caminoes", "Camino de Santiago in 30 seconds", "HistorySnack", "ES",
    "Caminan cientos de kilómetros. Camino, conchas, catedrales.",
    ["#HistorySnack", "#CaminoDeSantiago", "parati"], "Santiago de Compostela"),
  clip("d29", "churroes", "Churros con chocolate", "FoodLab", "ES",
    "El antojito nocturno de España. Churros, azúcar, chocolate espeso.",
    ["#FoodLab", "#Churros", "parati"], "Madrid"),
  clip("d30", "flamenco", "30 days of Mexico & Spain", "MexicoIn30s", "BOTH",
    "30 días en 30 segundos. ¿Qué serie quieres después: comida, slang, viaje?",
    ["#MexicoIn30s", "#SpainIn30s", "parati"], "Ciudad de México"),
];

export function inferSeries(clip: { series?: SeriesId; tags: string[] }): SeriesId {
  if (clip.series) return clip.series;
  const tags = clip.tags.map((t) => t.toLowerCase().replace("#", ""));
  if (tags.some((t) => ["maya", "azteca", "mexica", "piramide", "olmeca", "teotihuacan"].includes(t)))
    return "HistorySnack";
  if (tags.some((t) => ["tacos", "elote", "comida", "cacao", "churros"].includes(t)))
    return "FoodLab";
  if (tags.some((t) => ["muertos", "fiesta", "mariachi"].includes(t))) return "FestivalFiles";
  return "MexicoIn30s";
}

export function inferCountry(clip: { country?: ClipCountry }): ClipCountry {
  if (clip.country) return clip.country;
  return "MX";
}

export function matchesCulture(
  clip: { series?: SeriesId; country?: ClipCountry; tags: string[] },
  country: "ALL" | ClipCountry,
  series: "ALL" | SeriesId,
) {
  const c = inferCountry(clip);
  const s = inferSeries(clip);
  if (country === "MX" && c === "ES") return false;
  if (country === "ES" && c === "MX") return false;
  if (country === "BOTH" && c !== "BOTH") return false;
  if (series !== "ALL" && s !== series) return false;
  return true;
}
