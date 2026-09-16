/**
 * Otealo region pack — México / es-MX
 * Single source for brand, locale, cities, and feed tags.
 * Swap this file to retarget the app. Do not point at Zyeuté keys.
 */
export const region = {
  brand: "Otealo",
  tagline: "Videos de México",
  locale: "es-MX",
  locales: ["es-MX", "en"] as const,
  timezone: "America/Mexico_City",
  currency: "MXN",
  country: "MX",
  hive: "mexico",
  siteUrl: "https://ojea-mexico.netlify.app",
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
    "mexico",
    "tacos",
    "guadalajara",
    "monterrey",
    "musica",
    "futbol",
    "playa",
    "lucha",
  ],
  exploreCategories: [
    { id: "all", es: "Para ti", en: "For you", match: [] as string[] },
    { id: "comida", es: "Comida", en: "Food", match: ["taco", "comida", "trompo", "pastor", "chile"] },
    { id: "musica", es: "Música", en: "Music", match: ["musica", "cumbia", "sonido", "banda"] },
    { id: "futbol", es: "Fútbol", en: "Soccer", match: ["futbol", "gol", "estadio"] },
    { id: "playa", es: "Playa", en: "Beach", match: ["playa", "cancun", "mar"] },
    { id: "lucha", es: "Lucha", en: "Lucha", match: ["lucha", "arena"] },
    { id: "cdmx", es: "CDMX", en: "CDMX", match: ["cdmx", "roma", "ciudad"] },
  ],
  trending: [
    { q: "tacos", es: "Tacos al pastor", en: "Tacos al pastor" },
    { q: "lucha", es: "Lucha libre", en: "Lucha libre" },
    { q: "cancun", es: "Cancún", en: "Cancún" },
    { q: "cumbia", es: "Cumbia", en: "Cumbia" },
    { q: "cdmx", es: "CDMX de noche", en: "CDMX at night" },
    { q: "oaxaca", es: "Oaxaca", en: "Oaxaca" },
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
