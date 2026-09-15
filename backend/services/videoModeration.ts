/**
 * Video Moderation Service
 * Analyzes video content for safety violations before publication
 * Uses Gemini Vision API to analyze video frames/content
 */

import { getGeminiModel } from "../ai/google.js";
import { logger } from "../utils/logger.js";
import { v3Mod } from "../v3-swarm.js";

export interface VideoModerationResult {
  approved: boolean;
  severity: "safe" | "low" | "medium" | "high" | "critical";
  reasons: string[];
  confidence: number;
  reason: string;
  is_minor_danger?: boolean;
}

/**
 * Moderate video content using Gemini Vision API
 * Analyzes video directly (Gemini 1.5+ supports video input)
 */
export async function moderateVideo(
  videoBuffer: Buffer,
  videoMimeType: string = "video/mp4",
  caption?: string,
): Promise<VideoModerationResult> {
  try {
    // First, moderate the caption/text if provided
    if (caption) {
      const textModResult = await v3Mod(caption);
      if (textModResult.is_minor_danger) {
        logger.warn(`🚨 [VideoModeration] Child safety violation in caption`);
        return {
          approved: false,
          severity: "critical",
          reasons: ["minor_danger", "child_safety"],
          confidence: 100,
          reason: "Contenu dangereux détecté dans la description",
          is_minor_danger: true,
        };
      }
      if (textModResult.status === "reject_regenerate") {
        logger.warn(
          `⚠️ [VideoModeration] Caption rejected: ${textModResult.reason}`,
        );
        return {
          approved: false,
          severity: "high",
          reasons: ["inappropriate_text"],
          confidence: 90,
          reason: textModResult.reason || "Description inappropriée",
        };
      }
    }

    // Get Gemini model for video analysis
    const model = getGeminiModel("gemini-1.5-flash");
    if (!model) {
      logger.warn(
        "[VideoModeration] Gemini model not available, allowing video",
      );
      return {
        approved: true,
        severity: "safe",
        reasons: [],
        confidence: 0,
        reason: "Service de modération indisponible",
      };
    }

    // Convert video buffer to base64
    const base64Video = videoBuffer.toString("base64");

    const moderationPrompt = `Tu es V3-MOD, le gardien de la modération pour Ojea.
Ta mission principale est de protéger notre communauté, surtout les mineurs.

POLITIQUE STRICTE:
1. TOLÉRANCE ZÉRO pour le leurre d'enfants, le grooming, ou toute interaction inappropriée avec des mineurs.
2. TOLÉRANCE ZÉRO pour les discours haineux, la violence extrême, ou les actes illégaux.
3. TOLÉRANCE ZÉRO pour la nudité explicite, le contenu sexuel, ou la pornographie.
4. TOLÉRANCE ZÉRO pour la violence graphique, le gore, ou le contenu choquant.
5. PERMIS: Le mexicano mexicano (tabarnak, crisse, etc.) est accepté SAUF s'il est utilisé pour harceler ou violer les politiques ci-dessus.

Analyse cette vidéo et réponds UNIQUEMENT en JSON:
{
  "approved": boolean,
  "severity": "safe" | "low" | "medium" | "high" | "critical",
  "reasons": ["violence", "nudity", "hate_speech", "minor_danger", "illegal", etc.],
  "confidence": 0-100,
  "reason": "Explication claire en français",
  "is_minor_danger": boolean
}

Si "is_minor_danger" est true, cela signifie que le contenu viole la politique stricte de sécurité des enfants.`;

    // Analyze video with Gemini Vision API
    const result = await (model as any).generateContent([
      {
        inlineData: {
          mimeType: videoMimeType,
          data: base64Video,
        },
      },
      { text: moderationPrompt },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error(
        "[VideoModeration] No valid JSON found in AI response:",
        text,
      );
      // Fail-safe: allow but flag for review
      return {
        approved: true,
        severity: "low",
        reasons: ["parse_error"],
        confidence: 0,
        reason: "Erreur d'analyse, vidéo marquée pour révision",
      };
    }

    const moderation = JSON.parse(jsonMatch[0]);

    const modResult: VideoModerationResult = {
      approved: moderation.approved ?? true,
      severity: moderation.severity || "safe",
      reasons: moderation.reasons || [],
      confidence: moderation.confidence || 0,
      reason: moderation.reason || "",
      is_minor_danger: moderation.is_minor_danger || false,
    };

    // Critical violations: always reject
    if (modResult.is_minor_danger || modResult.severity === "critical") {
      logger.error(
        `🚨 [VideoModeration] CRITICAL VIOLATION: ${modResult.reason}`,
      );
      modResult.approved = false;
    }

    // High severity: reject
    if (modResult.severity === "high") {
      logger.warn(`⚠️ [VideoModeration] HIGH SEVERITY: ${modResult.reason}`);
      modResult.approved = false;
    }

    logger.info(
      `[VideoModeration] Video ${modResult.approved ? "APPROVED" : "REJECTED"} - Severity: ${modResult.severity}, Confidence: ${modResult.confidence}%`,
    );

    return modResult;
  } catch (error: any) {
    logger.error(`[VideoModeration] Error: ${error.message}`, error);
    // Fail-safe: allow but flag for manual review
    return {
      approved: true,
      severity: "low",
      reasons: ["moderation_error"],
      confidence: 0,
      reason: "Erreur de modération, vidéo marquée pour révision manuelle",
    };
  }
}

/**
 * Moderate video from URL (for already uploaded videos)
 */
export async function moderateVideoFromUrl(
  videoUrl: string,
  caption?: string,
): Promise<VideoModerationResult> {
  try {
    // Fetch video from URL
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const videoBuffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "video/mp4";

    return await moderateVideo(videoBuffer, contentType, caption);
  } catch (error: any) {
    logger.error(`[VideoModeration] Error fetching video: ${error.message}`);
    return {
      approved: true,
      severity: "low",
      reasons: ["fetch_error"],
      confidence: 0,
      reason: "Impossible de récupérer la vidéo pour analyse",
    };
  }
}
