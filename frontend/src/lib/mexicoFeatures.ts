/**
 * Ojea Mexico pack — cities, slang, hashtags.
 * Driven by config/region.ts so a pack swap stays in one place.
 */
import { region } from "@/config/region";

export const MEXICO_REGIONS = [
  { id: "cdmx", name: "Ciudad de México", emoji: "CDMX" },
  { id: "guadalajara", name: "Guadalajara", emoji: "GDL" },
  { id: "monterrey", name: "Monterrey", emoji: "MTY" },
  { id: "puebla", name: "Puebla", emoji: "PUE" },
  { id: "tijuana", name: "Tijuana", emoji: "TIJ" },
  { id: "merida", name: "Mérida", emoji: "MID" },
  { id: "cancun", name: "Cancún", emoji: "CUN" },
  { id: "oaxaca", name: "Oaxaca", emoji: "OAX" },
  { id: "leon", name: "León", emoji: "LEO" },
  { id: "queretaro", name: "Querétaro", emoji: "QRO" },
  { id: "tulum", name: "Tulum", emoji: "TU" },
  { id: "acapulco", name: "Acapulco", emoji: "ACA" },
] as const;

export const CDMX_COLONIAS = [
  { id: "roma", name: "Roma Norte", vibe: "Tacos a las 2am" },
  { id: "condesa", name: "Condesa", vibe: "Parque + café" },
  { id: "centro", name: "Centro Histórico", vibe: "Campanas y metro" },
  { id: "coyoacan", name: "Coyoacán", vibe: "Frida y mercados" },
  { id: "polanco", name: "Polanco", vibe: "Masaryk" },
  { id: "santa-fe", name: "Santa Fe", vibe: "Torres" },
  { id: "xochimilco", name: "Xochimilco", vibe: "Trajineras" },
  { id: "doctores", name: "Doctores", vibe: "Arena México" },
] as const;

export const MEXICAN_DICTIONARY = {
  like: "Fuego",
  comment: "Comentar",
  share: "Compartir",
  follow: "Seguir",
  unfollow: "Dejar de seguir",
  feed: "Para ti",
  explore: "Explorar",
  profile: "Perfil",
  notifications: "Notifs",
  messages: "Mensajes",
  settings: "Ajustes",
  post: "Publicar",
  caption: "Descripción",
  location: "Ubicación",
  addMusic: "Agregar sonido",
  filters: "Filtros",
  cool: "Chido",
  nice: "Qué padre",
  awesome: "Órale",
  lol: "Jajaja",
  yes: "Simón",
  no: "Nel",
  maybe: "A lo mejor",
  hot: "Hace un calorón",
  rain: "Está cayendo el aguacero",
} as const;

export const MEXICO_HASHTAGS = region.seedTags.map((tag) =>
  tag.startsWith("#") ? tag : `#${tag}`,
);

export const MEXICO_CITIES = region.cities;

/** Back-compat aliases so existing Zyeute imports keep compiling. */
export const QUEBEC_REGIONS = MEXICO_REGIONS;
export const MONTREAL_QUARTIERS = CDMX_COLONIAS;
export const JOUAL_DICTIONARY = MEXICAN_DICTIONARY;
export const QUEBEC_HASHTAGS = MEXICO_HASHTAGS;
