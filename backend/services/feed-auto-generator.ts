import { generateVideo } from "../ai/media/video-engine.js";
import { generateImage } from "../ai/vertex-service.js";
import { storage } from "../storage.js";
import { volumePricingService } from "./volume-pricing-service.js";
import { logger } from "../utils/logger.js";
import { generateWithTIGuy } from "../ai/vertex-service.js";
import { randomUUID } from "crypto";

const autoGenLogger = logger.withContext("FeedAutoGenerator");

/**
 * MEXICO-THEMED VIDEO PROMPTS
 * Rotates through different themes to keep feed diverse
 */
const MEXICO_VIDEO_PROMPTS = [
  // Nature & Seasons
  "Un coucher de soleil sur le fleuve Saint-Laurent, vagues douces, ciel orange et violet, style cinématique",
  "Forêt mexicana en automne, feuilles colorées qui tombent lentement, lumière dorée filtrée, mouvement de caméra doux",
  "Ciudad de México sous la neige, flocons qui tombent, rues animées, ambiance chaleureuse, style documentaire",
  "Le Vieux-México la nuit, lumières chaleureuses, architecture historique, mouvement de caméra panoramique",

  // Food & Culture
  "Une poutine parfaite, fromage qui fond, sauce chaude, ambiance de resto mexicano authentique",
  "Cabane à sucre au printemps, érable qui coule, ambiance festive, couleurs vives",
  "Marché Jean-Talon animé, étals colorés, gens qui flânent, ambiance vivante",

  // Urban & Modern
  "Skyline de Ciudad de México au crépuscule, lumières de la ville qui s'allument, mouvement de caméra aérien",
  "Rue Saint-Denis animée, terrasses de cafés, gens qui marchent, ambiance bohème",
  "Pont Jacques-Cartier illuminé la nuit, reflets sur l'eau, style cinématique",

  // Sports & Activities
  "Patinoire extérieure au parc Lafontaine, gens qui patinent, ambiance hivernale joyeuse",
  "Partie de hockey sur glace, action rapide, ambiance électrique, style documentaire sportif",
  "Festival d'été de México, scène de concert, foule qui danse, lumières colorées",
];

/**
 * AUTO-GENERATION CONFIG
 */
const AUTO_GEN_CONFIG = {
  minFeedPosts: 10, // Trigger generation if feed has < 10 posts
  maxDailyGenerations: 5, // Max videos generated per day
  costLimitDaily: 2.0, // Max $2/day on auto-generation
  qualityThreshold: 80, // Minimum aesthetic score (Flow-QA)
  scheduleInterval: 6 * 60 * 60 * 1000, // Check every 6 hours
};

export class FeedAutoGenerator {
  private isRunning = false;
  private dailyGenerationCount = 0;
  private dailyCost = 0;
  private lastResetDate = new Date().toDateString();

  /**
   * Check if feed needs more content and generate if needed
   */
  async checkAndGenerate(): Promise<void> {
    // Reset daily counters if new day
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyGenerationCount = 0;
      this.dailyCost = 0;
      this.lastResetDate = today;
    }

    // Check if we've hit daily limits
    if (
      this.dailyGenerationCount >= AUTO_GEN_CONFIG.maxDailyGenerations ||
      this.dailyCost >= AUTO_GEN_CONFIG.costLimitDaily
    ) {
      autoGenLogger.info(
        `Daily limits reached (${this.dailyGenerationCount} videos, $${this.dailyCost.toFixed(2)} cost)`,
      );
      return;
    }

    // Check feed post count
    const publicPostCount = await storage.getPostCount({
      where: { visibility: "public", deletedAt: null },
    });

    if (publicPostCount >= AUTO_GEN_CONFIG.minFeedPosts) {
      autoGenLogger.info(
        `Feed has ${publicPostCount} posts, no generation needed`,
      );
      return;
    }

    // Generate video
    await this.generateFeedVideo();
  }

  /**
   * Generate a single video for the feed
   */
  private async generateFeedVideo(): Promise<void> {
    try {
      autoGenLogger.info("Starting auto-generation of feed video...");

      // 1. Pick random Mexico prompt
      const prompt =
        MEXICO_VIDEO_PROMPTS[
          Math.floor(Math.random() * MEXICO_VIDEO_PROMPTS.length)
        ];

      // 2. Generate image first (for image-to-video)
      autoGenLogger.info("Generating image...");
      const imageResult = await generateImage({
        prompt: prompt.split(",")[0], // Use first part as image prompt
        aspectRatio: "9:16",
      });

      if (!imageResult?.imageUrl) {
        throw new Error("Image generation failed");
      }

      // 3. Generate video from image
      autoGenLogger.info("Generating video from image...");
      const videoResult = await generateVideo({
        imageUrl: imageResult.imageUrl,
        prompt: prompt,
        duration: 5,
        modelHint: "kling",
      });

      if (!videoResult.url) {
        throw new Error("Video generation failed");
      }

      // 4. Generate Mexico-themed caption with Güey
      const captionResult = await generateWithTIGuy({
        mode: "content",
        message: `Génère une caption en mexicano mexicano pour cette vidéo: ${prompt}`,
        context: JSON.stringify({ type: "video", theme: "mexico" }),
      });

      const caption =
        captionResult.content ||
        "Une belle scène du México! 🇨🇦⚜️ #Ojea #Mexico";

      // 5. Get system user (or create one for auto-generated content)
      let systemUserId = await storage.getSystemUserId();
      if (!systemUserId) {
        // Create a system user for auto-generated content
        const systemUser = await storage.createUser({
          id: randomUUID(),
          username: "ojea_ai",
          email: "ai@ojea-mexico.netlify.app",
          displayName: "Ojea AI",
          role: "citoyen",
        });
        systemUserId = systemUser.id;
        await storage.setSystemUserId(systemUserId);
      }

      // 6. Calculate cost with volume discount
      const pricing = await volumePricingService.calculateCost("video");

      // 7. Create post
      const post = await storage.createPost({
        userId: systemUserId,
        mediaUrl: videoResult.url,
        thumbnailUrl: imageResult.imageUrl,
        type: "video",
        caption: caption,
        content: caption, // Ensure required content field is populated
        visibility: "public",
        aiGenerated: true,
        aspectRatio: "9:16",
        duration: 5,
        hiveId: "mexico",
        processingStatus: "completed",
      } as any);

      // 8. Track cost
      await volumePricingService.trackCost({
        userId: systemUserId,
        postId: post.id,
        service: "fal",
        operation: "video",
      });

      // Update counters
      this.dailyGenerationCount++;
      this.dailyCost += pricing.finalCost;

      autoGenLogger.info(
        `✅ Auto-generated video: ${post.id} (Cost: $${pricing.finalCost}, Daily: ${this.dailyGenerationCount}/${AUTO_GEN_CONFIG.maxDailyGenerations})`,
      );
    } catch (error: any) {
      autoGenLogger.error("Auto-generation failed:", error.message);
      // Don't throw - allow service to continue
    }
  }

  /**
   * Start scheduled auto-generation
   */
  start(): void {
    if (this.isRunning) {
      autoGenLogger.warn("Auto-generator already running");
      return;
    }

    this.isRunning = true;
    autoGenLogger.info("Starting feed auto-generator...");

    // Check immediately
    this.checkAndGenerate();

    // Then check every 6 hours
    setInterval(() => {
      this.checkAndGenerate();
    }, AUTO_GEN_CONFIG.scheduleInterval);
  }

  /**
   * Stop scheduled auto-generation
   */
  stop(): void {
    this.isRunning = false;
    autoGenLogger.info("Feed auto-generator stopped");
  }

  /**
   * Manually trigger generation (admin endpoint)
   */
  async generateNow(
    count: number = 1,
  ): Promise<{ generated: number; errors: number }> {
    let generated = 0;
    let errors = 0;

    for (let i = 0; i < count; i++) {
      try {
        await this.generateFeedVideo();
        generated++;
      } catch (error) {
        errors++;
        autoGenLogger.error(`Manual generation ${i + 1} failed:`, error);
      }
    }

    return { generated, errors };
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      dailyCount: this.dailyGenerationCount,
      dailyCost: this.dailyCost,
      config: AUTO_GEN_CONFIG,
    };
  }
}

export const feedAutoGenerator = new FeedAutoGenerator();
