import type { RankingAlan, RankingYear } from "./types";

export function getWeights(alan: RankingAlan) {
  switch (alan) {
    case "Eşit Ağırlık": return { tyt: 0.45, ayt: 0.55 };
    case "Sözel": return { tyt: 0.5, ayt: 0.5 };
    case "Dil": return { tyt: 0.35, ayt: 0.65 };
    default: return { tyt: 0.4, ayt: 0.6 };
  }
}

export function getYearDifficulty(year: RankingYear) {
  if (year === 2025) return 0.985;
  if (year === 2026) return 0.965;
  return 1;
}

export function getRankAdjustment(year: RankingYear) {
  if (year === 2025) return 1.10;
  if (year === 2026) return 1.22;
  return 1;
}
