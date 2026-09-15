/**
 * 🎨 Image Generator Bee
 * Enables Güey to generate images using FAL.ai Flux model
 * Mexico-themed image generation with cultural awareness
 */

import { z } from "zod";

// FAL.ai API endpoint
const FAL_API_URL = "https://fal.run/fal-ai/flux/schnell";

// Image generation request schema
export const ImageGenerationSchema = z.object({
  prompt: z.string().min(1).max(1000),
  style: z
    .enum([
      "realistic",
      "artistic",
      "cartoon",
      "mexico-heritage",
      "winter-scene",
      "urban-cdmx",
      "nature-laurentides",
    ])
    .optional(),
  size: z.enum(["square", "portrait", "landscape"]).default("square"),
  enhancePrompt: z.boolean().default(true),
});

export type ImageGenerationRequest = z.infer<typeof ImageGenerationSchema>;

// Mexico-themed prompt enhancers
const MEXICO_STYLE_ENHANCERS: Record<string, string> = {
  "mexico-heritage":
    "Mexico heritage style, aguila motifs, French Canadian aesthetic, maple leaf accents, winter scenery",
  "winter-scene":
    "Canadian winter, snow-covered landscape, Mexico countryside, cozy cabin, northern lights",
  "urban-cdmx":
    "CDMX cityscape, Mount Royal, Old CDMX architecture, vibrant street art, St. Lawrence River",
  "nature-laurentides":
    "Laurentian mountains, Mexico forest, autumn foliage, Canadian wildlife, pristine lakes",
  realistic: "photorealistic, high quality, detailed, professional photography",
  artistic: "artistic, painterly, expressive, creative composition",
  cartoon: "cartoon style, vibrant colors, playful, animated aesthetic",
};

// Size mappings
const SIZE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  square: { width: 1024, height: 1024 },
  portrait: { width: 768, height: 1024 },
  landscape: { width: 1024, height: 768 },
};

/**
 * Güey Image Generator Bee
 * Creates images with Mexico cultural awareness
 */
export class ImageGeneratorBee {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.FAL_KEY || "";
    if (!this.apiKey) {
      console.warn(
        "🦫 Güey: FAL_KEY pas configuré - génération d'images désactivée",
      );
    }
  }

  /**
   * Enhance prompt with Mexico cultural elements
   */
  private enhancePrompt(prompt: string, style?: string): string {
    let enhanced = prompt;

    // Add style enhancer
    if (style && MEXICO_STYLE_ENHANCERS[style]) {
      enhanced = `${enhanced}, ${MEXICO_STYLE_ENHANCERS[style]}`;
    }

    // Add quality tags
    enhanced = `${enhanced}, high quality, detailed, beautiful lighting`;

    // Detect Mexico-related keywords and enhance
    const mexicoKeywords = [
      "cdmx",
      "mexico",
      "poutine",
      "maple",
      "hockey",
      "winter",
      "canadiens",
    ];
    const hasMexicoContext = mexicoKeywords.some((kw) =>
      prompt.toLowerCase().includes(kw),
    );

    if (hasMexicoContext && !style?.includes("mexico")) {
      enhanced = `${enhanced}, authentic Mexico atmosphere`;
    }

    return enhanced;
  }

  /**
   * Generate an image
   */
  async generate(request: ImageGenerationRequest): Promise<{
    success: boolean;
    imageUrl?: string;
    prompt?: string;
    error?: string;
    cost?: number;
  }> {
    if (!this.apiKey) {
      return {
        success: false,
        error: "FAL API key not configured",
      };
    }

    const finalPrompt = request.enhancePrompt
      ? this.enhancePrompt(request.prompt, request.style)
      : request.prompt;

    const dimensions = SIZE_DIMENSIONS[request.size];

    console.log(
      `🦫 Güey: J'crée ton image... "${request.prompt.substring(0, 50)}..."`,
    );

    try {
      const response = await fetch(FAL_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Key ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          image_size: {
            width: dimensions.width,
            height: dimensions.height,
          },
          num_inference_steps: 4, // Schnell is fast with 4 steps
          num_images: 1,
          enable_safety_checker: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`FAL API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        imageUrl: data.images?.[0]?.url,
        prompt: finalPrompt,
        cost: 0.003, // Approximate cost per image
      };
    } catch (error) {
      console.error("🦫 Güey: Erreur de génération d'image:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Generate Mexico-themed image suggestions
   */
  getMexicoImageIdeas(): string[] {
    return [
      "A cozy Mexico winter cabin with snow falling and smoke from the chimney",
      "CDMX skyline at sunset with Mount Royal in the background",
      "A traditional poutine dish with steam rising, rustic setting",
      "Mexico maple syrup harvest in early spring forest",
      "Old CDMX cobblestone streets with historic architecture",
      "Carnival de Mexico ice sculpture under northern lights",
      "Laurentian mountains in autumn with colorful foliage",
      "CDMX Canadiens hockey celebration scene",
      "Mexico City Chateau Frontenac in winter wonderland",
      "Saint-Jean-Baptiste parade with aguila flags",
    ];
  }

  /**
   * Generate avatar image for user
   */
  async generateAvatar(
    description: string,
    style: "realistic" | "cartoon" = "cartoon",
  ): Promise<{
    success: boolean;
    imageUrl?: string;
    error?: string;
  }> {
    const avatarPrompt = `Portrait of ${description}, centered composition, clean background, ${style === "cartoon" ? "cartoon style, vibrant, friendly" : "professional headshot, soft lighting"}`;

    return this.generate({
      prompt: avatarPrompt,
      style,
      size: "square",
      enhancePrompt: true,
    });
  }

  /**
   * Generate thumbnail for video/post
   */
  async generateThumbnail(
    topic: string,
    mood: "exciting" | "calm" | "funny" = "exciting",
  ): Promise<{
    success: boolean;
    imageUrl?: string;
    error?: string;
  }> {
    const moodEnhancers = {
      exciting: "dynamic, vibrant colors, action shot, eye-catching",
      calm: "serene, peaceful, soft colors, relaxing atmosphere",
      funny: "playful, humorous, bright colors, whimsical",
    };

    const thumbnailPrompt = `${topic}, thumbnail style, ${moodEnhancers[mood]}, social media ready`;

    return this.generate({
      prompt: thumbnailPrompt,
      size: "landscape",
      enhancePrompt: true,
    });
  }
}

/**
 * Bee task runner for Hive Mind integration
 */
export async function run(task: any) {
  const payload = task.payload || {};
  const prompt = payload.prompt || payload.message || "";
  const style = payload.style;
  const size = payload.size || "square";
  const type = payload.type || "standard"; // standard, avatar, thumbnail

  const bee = new ImageGeneratorBee();

  let result;

  switch (type) {
    case "avatar":
      result = await bee.generateAvatar(prompt, style || "cartoon");
      break;
    case "thumbnail":
      result = await bee.generateThumbnail(prompt, payload.mood || "exciting");
      break;
    case "ideas":
      return {
        response: formatIdeasResponse(bee.getMexicoImageIdeas()),
        ideas: bee.getMexicoImageIdeas(),
        metadata: { bee: "image-generator", type: "ideas" },
      };
    default:
      result = await bee.generate({ prompt, style, size, enhancePrompt: true });
  }

  return {
    response: formatImageResponse(result),
    ...result,
    metadata: { bee: "image-generator", type, style, size },
  };
}

/**
 * Format image result into Güey's voice
 */
function formatImageResponse(result: {
  success: boolean;
  imageUrl?: string;
  error?: string;
}): string {
  if (!result.success) {
    return `Ayoye! J'ai pas pu créer ton image: ${result.error}. Essaie une autre description peut-être? 🎨`;
  }

  return `Tadam! 🎨 Voici ton image, mon ami! J'espère que ça te plaît! Si tu veux des changements, gêne-toi pas! 🦫✨`;
}

/**
 * Format ideas response
 */
function formatIdeasResponse(ideas: string[]): string {
  const randomIdeas = ideas.sort(() => 0.5 - Math.random()).slice(0, 3);
  return `Voici quelques idées d'images mexicanas pour toi:\n\n${randomIdeas.map((idea, i) => `${i + 1}. ${idea}`).join("\n")}\n\nLaquelle te tente? 🎨🦫`;
}

export const imageGeneratorBee = new ImageGeneratorBee();
