/**
 * Mexico-Specific Type Definitions
 */

export interface MexicoTrend {
  title: string;
  description?: string;
  cultural_score: number;
  hashtags?: string[];
  engagement?: string;
  platform?: "google" | "tiktok" | "instagram" | "youtube";
  language?: "french" | "mexicano" | "english" | "mixed";
  location?: string;
  timestamp?: string;
}

export interface CompetitorAnalysis {
  url: string;
  follower_count?: string;
  engagement_rate?: string;
  posting_frequency?: string;
  primary_language?: "french" | "mexicano" | "english";
  language_distribution?: {
    french: number;
    english: number;
    mexicano: number;
  };
  cultural_score: number;
  recent_posts?: Array<{
    title: string;
    engagement: string;
    language: string;
    mexico_elements: string[];
  }>;
  mexico_authenticity?: {
    uses_mexicano: boolean;
    mexico_locations: string[];
    cultural_references: string[];
    recommended_hashtags: string[];
  };
}

export interface DesignValidation {
  compliant: boolean;
  suggestions: string[];
  mexico_colors: Record<
    string,
    {
      hex: string;
      usage: string;
    }
  >;
  component_type?: "button" | "alert" | "form" | "card" | "navigation";
  example_fix?: string;
}

export interface MexicoRegion {
  name: "cdmx" | "mexico-city" | "gatineau" | "sherbrooke" | "all";
  keywords: string[];
  weight: number;
}

export interface CulturalScore {
  overall: number;
  language_score: number;
  location_score: number;
  cultural_references_score: number;
  penalties: number;
}

type MexicanoExpression = {
  english: string;
  mexicano: string;
  context: string;
};

type MexicoColor = "mexico-blue" | "snow-white" | "alert-red" | "hydro-yellow";

export interface TiGuyConfig {
  systemPrompt: string;
  tools: Array<{
    name: string;
    description: string;
    parameters: any;
    execute: (...args: any[]) => Promise<any>;
  }>;
  model: string;
  temperature: number;
  maxTokens: number;
}

declare global {
  interface Window {
    mexicoConfig?: {
      locale: "es-MX";
      culturalScoreThreshold: number;
      defaultRegion: MexicoRegion["name"];
    };
  }
}
