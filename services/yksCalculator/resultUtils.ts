import type { CalculatedExamResult, RankingEstimate } from "@/types/exam";

export function getBestEstimate(result: CalculatedExamResult): RankingEstimate {
  return result.estimates.reduce((best, current) => current.siralama < best.siralama ? current : best);
}

export function getWorstEstimate(result: CalculatedExamResult): RankingEstimate {
  return result.estimates.reduce((worst, current) => current.siralama > worst.siralama ? current : worst);
}

export function getAverageRanking(result: CalculatedExamResult): number {
  return Math.round(result.estimates.reduce((sum, item) => sum + item.siralama, 0) / result.estimates.length);
}

export function getYearEstimate(result: CalculatedExamResult, year: 2024 | 2025 | 2026): RankingEstimate {
  return result.estimates.find((estimate) => estimate.year === year) ?? result.estimates[0];
}

export function getRankingDifference(result: CalculatedExamResult) {
  const values = result.estimates.map((estimate) => estimate.siralama);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max, difference: max - min };
}

export function getWeightedNet(tytNet: number, aytNet: number): number {
  return Number((tytNet * 0.4 + aytNet * 0.6).toFixed(2));
}

export function isTargetReached(currentTYT: number, currentAYT: number, targetTYT: number, targetAYT: number): boolean {
  return currentTYT >= targetTYT && currentAYT >= targetAYT;
}
