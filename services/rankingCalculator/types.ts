import type { RankingTarget } from "@/lib/constants/rankingTargets";

export type RankingAlan = "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil";
export type RankingYear = 2024 | 2025 | 2026;

export interface RankingCalculatorInput {
  alan: RankingAlan;
  year: RankingYear;
  tyt: number;
  ayt: number;
  obp: number;
}

export interface RankingCalculatorResult {
  estimatedRank: number;
  target: RankingTarget | null;
  confidence: number;
}
