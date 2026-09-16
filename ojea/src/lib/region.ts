/**
 * Otealo region pack — México / es-MX
 * Single source for brand, locale, cities, and feed tags.
 * Swap this file to retarget the app. Do not point at Zyeuté keys.
 */
export const region = {
  brand: "Otealo",
  tagline: "¿Y allá cómo está?",
  locale: "es-MX",
  locales: ["es-MX", "en"] as const,
  timezone: "America/Mexico_City",
  currency: "MXN",
  country: "MX",
  hive: "mexico",
  siteUrl: "https://otealo.com",
  supabaseProject: "MexicoV5",
  cities: [
    "Ciudad de México",
    "Guadalajara",
    "Monterrey",
    "Puebla",
    "Tijuana",
    "Mérida",
    "Cancún",
    "Oaxaca",
    "León",
    "Querétaro",
  ],
  seedTags: [
    "parati",
    "cdmx",
    "tacos",
    "oaxaca",
    "piramides",
    "mariachi",
    "futbol",
    "playa",
    "lucha",
    "mezcal",
  ],
  exploreCategories: [
    { id: "all", es: "Hoy", en: "Today", match: [] as string[] },
    { id: "comida", es: "Comida", en: "Food", match: ["taco", "comida", "trompo", "pastor", "chile", "elote", "tamal", "guacamole", "mole", "mezcal"] },
    { id: "historia", es: "Historia", en: "History", match: ["piramide", "maya", "azteca", "teotihuacan", "templo", "olmec", "palenque"] },
    { id: "musica", es: "Música", en: "Music", match: ["musica", "mariachi", "cumbia", "sonido", "banda", "folklor", "jarabe"] },
    { id: "futbol", es: "Fútbol", en: "Soccer", match: ["futbol", "gol", "estadio", "aficion", "azteca"] },
    { id: "playa", es: "Playa", en: "Beach", match: ["playa", "cancun", "mar", "caribe", "cenote", "vallarta"] },
    { id: "lucha", es: "Lucha", en: "Lucha", match: ["lucha", "arena"] },
    { id: "cdmx", es: "CDMX", en: "CDMX", match: ["cdmx", "roma", "ciudad", "zocalo", "reforma"] },
  ],
  trending: [
    { q: "tacos", es: "Tacos al pastor", en: "Tacos al pastor" },
    { q: "piramide", es: "Pirámides", en: "Pyramids" },
    { q: "mariachi", es: "Mariachi", en: "Mariachi" },
    { q: "lucha", es: "Lucha libre", en: "Lucha libre" },
    { q: "futbol", es: "Fútbol", en: "Football" },
    { q: "oaxaca", es: "Oaxaca", en: "Oaxaca" },
    { q: "cancun", es: "Cancún", en: "Cancún" },
    { q: "cdmx", es: "CDMX de noche", en: "CDMX at night" },
  ],
} as const;

export type Region = typeof region;
export type RegionCity = (typeof region.cities)[number];

const HOME_KEY = "ojea-home-city";

export function getHomeCity(): RegionCity {
  try {
    const saved = localStorage.getItem(HOME_KEY);
    if (saved && (region.cities as readonly string[]).includes(saved)) {
      return saved as RegionCity;
    }
  } catch {
    /* ignore */
  }
  return region.cities[0];
}

export function setHomeCity(city: RegionCity) {
  try {
    localStorage.setItem(HOME_KEY, city);
  } catch {
    /* ignore */
  }
}

export default region;
