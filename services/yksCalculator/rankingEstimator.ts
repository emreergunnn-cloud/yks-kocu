import type { RankingEstimate } from "@/types/exam";
import { TABLE_2024, TABLE_2025, TABLE_2026 } from "./rankingTables";
import type { AlanType, RankingRow } from "./types";

function getWeightedNet(tyt: number, ayt: number, alan: AlanType): number {
  switch (alan) {
    case "Sayısal": return tyt * 0.4 + ayt * 0.6;
    case "Eşit Ağırlık": return tyt * 0.45 + ayt * 0.55;
    case "Sözel": return tyt * 0.5 + ayt * 0.5;
    case "Dil": return tyt * 0.35 + ayt * 0.65;
  }
}

function interpolateRank(target: number, upperRank: number, lowerRank: number, upper: number, lower: number): number {
  const ratio = (target - lower) / (upper - lower);
  return Math.round(lowerRank - (lowerRank - upperRank) * ratio);
}

function estimateRanking(tytNet: number, aytNet: number, obp: number, table: RankingRow[], alan: AlanType): number {
  const weightedNet = getWeightedNet(tytNet, aytNet, alan) + (obp - 50) * 0.04;
  const weightedTable = table.map((item) => ({
    rank: item.rank,
    weighted: getWeightedNet(item.tyt, item.ayt, alan) + 30 * 0.04,
  }));

  if (weightedNet >= weightedTable[0].weighted) return weightedTable[0].rank;
  const last = weightedTable[weightedTable.length - 1];
  if (weightedNet <= last.weighted) return last.rank;

  for (let i = 0; i < weightedTable.length - 1; i += 1) {
    const upper = weightedTable[i];
    const lower = weightedTable[i + 1];
    if (weightedNet <= upper.weighted && weightedNet >= lower.weighted) {
      return interpolateRank(weightedNet, upper.rank, lower.rank, upper.weighted, lower.weighted);
    }
  }
  return last.rank;
}

export function calculateRankingEstimates(tytNet: number, aytNet: number, obp: number, alan: AlanType): RankingEstimate[] {
  return [
    { year: 2024, siralama: estimateRanking(tytNet, aytNet, obp, TABLE_2024, alan) },
    { year: 2025, siralama: estimateRanking(tytNet, aytNet, obp, TABLE_2025, alan) },
    { year: 2026, siralama: estimateRanking(tytNet, aytNet, obp, TABLE_2026, alan) },
  ];
}
