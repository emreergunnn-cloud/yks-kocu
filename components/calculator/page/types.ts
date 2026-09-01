import type { RankingCalculatorResult } from "@/services/rankingCalculator";
export type CalculatorAlan = "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil";
export interface CalculatorResults {
  2024: RankingCalculatorResult;
  2025: RankingCalculatorResult;
  2026: RankingCalculatorResult;
  summary: { obpContribution: number; tytPercentage: number; aytPercentage: number };
}
