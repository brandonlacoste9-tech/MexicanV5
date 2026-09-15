/**
 * Ojea region pack — México / es-MX
 * Swap this file (and the seed queries) to retarget the OjeaV5 stack.
 * Do not point this fork at Ojea Supabase keys.
 */
export const region = {
  brand: "Ojea",
  tagline: "Videos de México",
  locale: "es-MX",
  locales: ["es-MX", "en"] as const,
  timezone: "America/Mexico_City",
  currency: "MXN",
  country: "MX",
  hive: "mexico",
  siteUrl: "https://ojea-mexico.netlify.app",
  supabaseUrl: "https://oqaswdsyqyecufdmwmxs.supabase.co",
  supabaseProject: "MexicoV5",
  flyRegion: "qro",
  videoBucket: "ojea-videos",
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
  tiktokQueries: [
    "#cdmx",
    "#mexico",
    "#parati",
    "#guadalajara",
    "#monterrey",
    "#tacos",
    "ciudad de mexico",
    "mexico viral",
    "cdmx nightlife",
    "cancun",
    "oaxaca",
    "tijuana",
    "puebla",
    "merida",
  ],
  pexelsQueries: [
    "mexico city",
    "cdmx street",
    "guadalajara mexico",
    "cancun beach",
    "oaxaca mexico",
    "tacos mexico",
    "lucha libre",
    "monterrey mexico",
  ],
  areaCodes: ["55", "33", "81", "222", "664", "999"],
} as const;

export type Region = typeof region;
export default region;
