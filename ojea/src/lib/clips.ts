import { seedClipVideoUrl } from "./media";
import { region } from "./region";

export type Comment = { user: string; text: string };

export type Clip = {
  id: string;
  user: string;
  displayName: string;
  caption: string;
  city: string;
  image: string;
  video?: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  sound: string;
  soundArtist: string;
  following?: boolean;
  live?: boolean;
  viewers?: number;
  shares?: number;
  friend?: boolean;
};

const RAW_CLIPS: Clip[] = [
  {
    id: "tacos",
    user: "chile_y_lima",
    displayName: "Chile y Lima",
    caption: "Pastor a las 2am en la Roma. Si no hay piña, no es pastor.",
    city: "Ciudad de México",
    image: "/clips/tacos.jpg",
    likes: 12400,
    comments: [
      { user: "taquero.sur", text: "¿Cuál taquería?" },
      { user: "hambre.mx", text: "Se me antojó feo" },
      { user: "roma.norte", text: "Roma best colonia" },
    ],
    tags: ["tacos", "CDMX", "parati"],
    sound: "Pastor a las 2",
    soundArtist: "Sonido Roma",
  },
  {
    id: "trompo",
    user: "chile_y_lima",
    displayName: "Chile y Lima",
    caption: "El trompo no miente. Naranja, piña, y la fila que da la vuelta.",
    city: "Ciudad de México",
    image: "/clips/trompo.jpg",
    likes: 18900,
    comments: [{ user: "noche.cdmx", text: "Esa luz es de iglesia" }],
    tags: ["tacos", "CDMX", "comida"],
    sound: "Trompo mix",
    soundArtist: "Sonido Roma",
    live: true,
    viewers: 1840,
  },
  {
    id: "gdl",
    user: "guadalajara.nights",
    displayName: "GDL Nights",
    caption: "Papel picado, calle viva. Jalisco no es México — es otra cosa.",
    city: "Guadalajara",
    image: "/clips/gdl.jpg",
    likes: 8100,
    comments: [
      { user: "tapatia", text: "Jalisco es México" },
      { user: "centro.gdl", text: "¿En qué calle?" },
    ],
    tags: ["Guadalajara", "parati"],
    sound: "Calle viva",
    soundArtist: "Banda Jalisco",
    following: true,
  },
  {
    id: "monterrey",
    user: "norteno.mx",
    displayName: "Norteño",
    caption: "El Cerro de la Silla no pide permiso. Siempre está.",
    city: "Monterrey",
    image: "/clips/monterrey.jpg",
    likes: 6700,
    comments: [{ user: "mty.pride", text: "Orgullo regiomontano" }],
    tags: ["Monterrey", "MTY"],
    sound: "Banda del Cerro",
    soundArtist: "Norteño MX",
    following: true,
  },
  {
    id: "merida",
    user: "yucatan.sabor",
    displayName: "Yucatán Sabor",
    caption: "Arco de San Juan. Cochinita después, si aguantas el calor.",
    city: "Mérida",
    image: "/clips/merida.jpg",
    likes: 9900,
    comments: [{ user: "peninsula", text: "Con cebolla morada o nada" }],
    tags: ["Merida", "Yucatan"],
    sound: "Trova de mediodía",
    soundArtist: "Yucatán Sabor",
  },
  {
    id: "zocalo",
    user: "centro.cdmx",
    displayName: "Centro CDMX",
    caption: "Catedral de noche. El Zócalo nunca duerme del todo.",
    city: "Ciudad de México",
    image: "/clips/zocalo.jpg",
    likes: 15200,
    comments: [{ user: "noctambulo", text: "Esa luz pega distinto" }],
    tags: ["CDMX", "zocalo"],
    sound: "Cumbia del Zócalo",
    soundArtist: "Centro CDMX",
    live: true,
    viewers: 920,
  },
  {
    id: "playa",
    user: "caribe.ojo",
    displayName: "Caribe Ojo",
    caption: "El Caribe no es filtro. Es así.",
    city: "Quintana Roo",
    image: "/clips/playa.jpg",
    likes: 22100,
    comments: [{ user: "playa.fan", text: "Ya quiero ir" }],
    tags: ["playa", "caribe"],
    sound: "Dembow Caribe",
    soundArtist: "Caribe Ojo",
  },
  {
    id: "cancun",
    user: "zona.hotelera",
    displayName: "Zona Hotelera",
    caption: "Cancún desde arriba. Turquesa de verdad.",
    city: "Cancún",
    image: "/clips/cancun.jpg",
    likes: 18800,
    comments: [{ user: "qroo", text: "Clásico" }],
    tags: ["Cancun", "playa"],
    sound: "House Hotelera",
    soundArtist: "Zona Hotelera",
    following: true,
  },
  {
    id: "puebla",
    user: "puebla.mole",
    displayName: "Puebla Mole",
    caption: "Mole que sí sabe a casa. Puebla no perdona mediocre.",
    city: "Puebla",
    image: "/clips/puebla.jpg",
    likes: 5400,
    comments: [{ user: "angelopolis", text: "Con arroz, por favor" }],
    tags: ["Puebla", "comida"],
    sound: "Son de Puebla",
    soundArtist: "Puebla Mole",
  },
  {
    id: "mercado",
    user: "tianguis.vivo",
    displayName: "Tianguis Vivo",
    caption: "Textiles, sol, cobblestone. El tianguis manda.",
    city: "Puebla",
    image: "/clips/mercado.jpg",
    likes: 4300,
    comments: [{ user: "artesana", text: "Me llevo el rebozo" }],
    tags: ["mercado", "Puebla"],
    sound: "Huapango tianguis",
    soundArtist: "Tianguis Vivo",
  },
  {
    id: "lucha",
    user: "arena.mexico",
    displayName: "Arena México",
    caption: "Tercera caída. Si no gritas, no estabas.",
    city: "Ciudad de México",
    image: "/clips/lucha.jpg",
    likes: 30100,
    comments: [
      { user: "rudo.oficial", text: "Esa máscara es leyenda" },
      { user: "tecnico", text: "Tercera caída siempre" },
    ],
    tags: ["lucha", "CDMX", "parati"],
    sound: "Campana de arena",
    soundArtist: "Arena México",
    live: true,
    viewers: 4120,
  },
  {
    id: "tulum",
    user: "caribe.ojo",
    displayName: "Caribe Ojo",
    caption: "Tulum sin influencer. Solo piedra, mar y el sol que pega.",
    city: "Tulum",
    image: "/clips/tulum.jpg",
    likes: 27400,
    comments: [{ user: "mayan.coast", text: "Esto sí es Quintana Roo" }],
    tags: ["playa", "Tulum", "caribe"],
    sound: "Selva Tulum",
    soundArtist: "Caribe Ojo",
  },
  {
    id: "oaxaca",
    user: "istmo.luz",
    displayName: "Istmo Luz",
    caption: "Oaxaca al atardecer. El papel picado ya es parte del cielo.",
    city: "Oaxaca",
    image: "/clips/oaxaca.jpg",
    likes: 14200,
    comments: [{ user: "mezcal.claro", text: "¿En Santo Domingo?" }],
    tags: ["Oaxaca", "parati"],
    sound: "Son istmeño",
    soundArtist: "Istmo Luz",
    following: true,
  },
  {
    id: "bellas",
    user: "centro.cdmx",
    displayName: "Centro CDMX",
    caption: "Bellas Artes después de la lluvia. El mármol se ve de oro.",
    city: "Ciudad de México",
    image: "/clips/bellas.jpg",
    likes: 19800,
    comments: [{ user: "cultura.mx", text: "Esta ciudad no se acaba" }],
    tags: ["CDMX", "cultura"],
    sound: "Nocturno Bellas Artes",
    soundArtist: "Centro CDMX",
  },
  {
    id: "alebrijes",
    user: "tianguis.vivo",
    displayName: "Tianguis Vivo",
    caption: "Alebrijes que te miran de vuelta. Hecho a mano, no de souvenir.",
    city: "Oaxaca",
    image: "/clips/alebrijes.jpg",
    likes: 8700,
    comments: [{ user: "taller.oax", text: "Ese jaguar está vivo" }],
    tags: ["Oaxaca", "mercado", "arte"],
    sound: "Alebrije beat",
    soundArtist: "Tianguis Vivo",
  },
];

export const SEED_CLIPS: Clip[] = RAW_CLIPS.map((c) => ({
  ...c,
  likes: 0,
  comments: [],
  shares: 0,
  live: false,
  viewers: undefined,
  following: false,
  friend: false,
  video: c.video ?? seedClipVideoUrl(c.id),
}));

export function mergeClipFeeds(...lists: Clip[][]) {
  const seen = new Set<string>();
  const out: Clip[] = [];
  for (const list of lists) {
    for (const clip of list) {
      if (!clip?.id || seen.has(clip.id)) continue;
      seen.add(clip.id);
      out.push(clip);
    }
  }
  return out;
}

export const FRIEND_USERS = [
  ...new Set(SEED_CLIPS.filter((c) => c.friend).map((c) => c.user)),
];

export const EXPLORE_TAGS = [...region.seedTags];

export const CITIES = [...region.cities];

export const STORIES = [
  { user: "chile_y_lima", image: "/clips/trompo.jpg" },
  { user: "arena.mexico", image: "/clips/lucha.jpg" },
  { user: "guadalajara.nights", image: "/clips/gdl.jpg" },
  { user: "caribe.ojo", image: "/clips/tulum.jpg" },
  { user: "istmo.luz", image: "/clips/oaxaca.jpg" },
  { user: "centro.cdmx", image: "/clips/bellas.jpg" },
  { user: "norteno.mx", image: "/clips/monterrey.jpg" },
];

export const SEED_NOTES: Array<{
  id: string;
  text: string;
  time: string;
  unread: boolean;
  kind: "feed" | "user" | "sound";
  user?: string;
  sound?: string;
}> = [];
