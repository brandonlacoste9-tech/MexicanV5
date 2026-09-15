/**
 * Mexicanize existing captions for the Ojea feed.
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://oqaswdsyqyecufdmwmxs.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY missing — MexicoV5 only, never Zyeuté keys");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MEXICO_CAPTIONS: Record<string, string[]> = {
  city: [
    "CDMX de noche. Si no hay trompo, no es pastor. #CDMX #parati",
    "Roma a las 2am. #tacos #Mexico",
    "El Zócalo no pide permiso. #CDMX",
  ],
  nature: [
    "El Cerro de la Silla siempre está. #Monterrey",
    "Oaxaca se ve de otro planeta. #Oaxaca #parati",
  ],
  beach: [
    "Tulum sin filtro de agencia. #playa #Mexico",
    "Cancún cuando baja el sol. #Cancun",
  ],
  food: [
    "Trompo, piña, y la fila que da la vuelta. #tacos",
    "Mole que sí sabe a casa. #Oaxaca",
  ],
  default: [
    "Hecho en México. #parati #Ojea",
    "Talento de aquí, no un feed genérico. #Mexico",
    "Ojea — videos de México. #CDMX",
  ],
};

function categorizeContent(caption: string): string {
  const lower = caption.toLowerCase();
  if (/(cdmx|ciudad de mexico|roma|zocalo)/.test(lower)) return "city";
  if (/(playa|tulum|cancun|playa)/.test(lower)) return "beach";
  if (/(taco|mole|comida|pastor)/.test(lower)) return "food";
  if (/(cerro|oaxaca|naturaleza)/.test(lower)) return "nature";
  return "default";
}

function pickCaption(category: string): string {
  const list = MEXICO_CAPTIONS[category] || MEXICO_CAPTIONS.default;
  return list[Math.floor(Math.random() * list.length)];
}

async function mexicanizeContent() {
  console.log("Mexicanizing existing content for Ojea / MexicoV5");
  const { data, error } = await supabase
    .from("publications")
    .select("id, caption")
    .limit(500);
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  for (const row of data ?? []) {
    const next = pickCaption(categorizeContent(String(row.caption ?? "")));
    await supabase.from("publications").update({ caption: next }).eq("id", row.id);
  }
  console.log(`Updated ${(data ?? []).length} captions`);
}

mexicanizeContent().catch((e) => {
  console.error(e);
  process.exit(1);
});
