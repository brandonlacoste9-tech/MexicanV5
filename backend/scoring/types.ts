export interface CulturalMomentum {
  postId: string;
  staticScore: number; // The original mexico_score
  soulScore: number; // Calculated from engagement
  recencyBias: number; // Decay factor
  finalRank: number;
}
