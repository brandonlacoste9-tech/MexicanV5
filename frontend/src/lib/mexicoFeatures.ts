/**
 * Ojea Mexico pack — cities, slang, hashtags.
 * Replaces the Québec region pack from ZyeuteV5.
 */
export const MEXICO_REGIONS = [
  { id: "cdmx", name: "Ciudad de México", emoji: "🏙️" },
  { id: "guadalajara", name: "Guadalajara", emoji: "🎺" },
  { id: "monterrey", name: "Monterrey", emoji: "⛰️" },
  { id: "puebla", name: "Puebla", emoji: "⛪" },
  { id: "tijuana", name: "Tijuana", emoji: "🌉" },
  { id: "merida", name: "Mérida", emoji: "🏛️" },
  { id: "cancun", name: "Cancún", emoji: "🏖️" },
  { id: "oaxaca", name: "Oaxaca", emoji: "🌽" },
  { id: "leon", name: "León", emoji: "👢" },
  { id: "queretaro", name: "Querétaro", emoji: "🎈" },
  { id: "tulum", name: "Tulum", emoji: "🌊" },
  { id: "acapulco", name: "Acapulco", emoji: "🌅" },
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
  like: "Fuego 🔥",
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
  awesome: "¡Órale!",
  lol: "Jajaja",
  yes: "Simón",
  no: "Nel",
  maybe: "A lo mejor",
  hot: "Hace un calorón",
  rain: "Está cayendo el aguacero",
} as const;

export const MEXICO_HASHTAGS = [
  "#parati",
  "#CDMX",
  "#Mexico",
  "#Tacos",
  "#Guadalajara",
  "#Monterrey",
  "#LuchaLibre",
  "#Mariachi",
  "#Playa",
  "#Oaxaca",
  "#Cancun",
  "#Futbol",
  "#55",
  "#GDL",
  "#MTY",
  "#HechoEnMexico",
] as const;

/** Back-compat aliases so existing Zyeute imports keep compiling. */
export const QUEBEC_REGIONS = MEXICO_REGIONS;
export const MONTREAL_QUARTIERS = CDMX_COLONIAS;
export const JOUAL_DICTIONARY = MEXICAN_DICTIONARY;
export const QUEBEC_HASHTAGS = MEXICO_HASHTAGS;
