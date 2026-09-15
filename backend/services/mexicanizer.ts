import { getGeminiModel } from "../ai/google.js";
import { getVertexGeminiModel } from "../ai/vertex-gemini.js";

export type MexicanStyle = "street" | "old" | "enhanced";
/** @deprecated use MexicanStyle */
export type JoualStyle = MexicanStyle;

/**
 * Mexicanizer — rewrite captions into authentic Mexican Spanish.
 */
export async function mexicanizeText(
  text: string,
  style: MexicanStyle,
): Promise<string> {
  const model =
    (await getVertexGeminiModel("gemini-1.5-flash")) ||
    getGeminiModel("gemini-1.5-flash");
  if (!model) {
    throw new Error("Gemini model not initialized");
  }

  const prompts: Record<MexicanStyle, string> = {
    street: `
      Eres Güey, experto en habla urbana de México.
      Reescribe el texto en español mexicano de calle (CDMX / GDL).
      Usa jerga natural (chido, órale, simón, qué onda, no manches),
      sin forzarlo. Es para una leyenda de video en Ojea.

      Texto original: "${text}"

      Responde SOLO con el texto reescrito.
    `,
    old: `
      Eres Güey, voz de rancho y tradición.
      Reescribe el texto en un español mexicano cálido y popular:
      mercados, feria, abuelos, refranes. Nada de marketing frío.

      Texto original: "${text}"

      Responde SOLO con el texto reescrito.
    `,
    enhanced: `
      Eres Güey, estratega de virales en Ojea.
      Reescribe para que enganche en el feed de México:
      hook al inicio, emojis justos, tono Ojea (auténtico, no genérico).

      Texto original: "${text}"

      Responde SOLO con el texto reescrito.
    `,
  };

  try {
    const result = await model.generateContent(prompts[style]);
    const response = await result.response;
    let rewrittenText = response.text().trim();
    rewrittenText = rewrittenText.replace(/^["']|["']$/g, "");
    return rewrittenText;
  } catch (error: any) {
    console.error(`[Mexicanizer] Error rewriting text:`, error.message);
    throw new Error("Failed to mexicanize text");
  }
}

/** @deprecated use mexicanizeText */
export const joualizeText = mexicanizeText;
