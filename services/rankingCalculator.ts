import { getRankingTargets } from "./ranking/targetLookup";
import { buildWeightedTable, getInputWeightedNet, interpolateRank } from "./rankingCalculator/helpers";
import { getRankAdjustment } from "./rankingCalculator/weights";
import type { RankingCalculatorInput, RankingCalculatorResult } from "./rankingCalculator/types";

export type { RankingCalculatorInput, RankingCalculatorResult } from "./rankingCalculator/types";

export function calculateEstimatedRanking(input: RankingCalculatorInput): RankingCalculatorResult {
  const table = getRankingTargets(input.alan, input.year);
  if (!table.length) return { estimatedRank: 0, target: null, confidence: 0 };

  const weightedNet = getInputWeightedNet(input);
  const weightedTable = buildWeightedTable(table, input);
  const first = weightedTable[0];
  const last = weightedTable[weightedTable.length - 1];

  if (weightedNet >= first.weighted) {
    return { estimatedRank: first.row.rank, target: first.row, confidence: 99 };
  }
  if (weightedNet <= last.weighted) {
    return { estimatedRank: last.row.rank, target: last.row, confidence: 60 };
  }

  for (let i = 0; i < weightedTable.length - 1; i += 1) {
    const upper = weightedTable[i];
    const lower = weightedTable[i + 1];
    if (weightedNet <= upper.weighted && weightedNet >= lower.weighted) {
      const rawRank = interpolateRank(weightedNet, upper.row.rank, lower.row.rank, upper.weighted, lower.weighted);
      const estimatedRank = Math.round(rawRank * getRankAdjustment(input.year));
      const diff = Math.abs(input.tyt - upper.tyt) * 0.45 + Math.abs(input.ayt - upper.ayt) * 0.55;
      const confidence = Math.round(Math.max(55, Math.min(99, 99 - diff * 2.2)));
      return { estimatedRank, target: upper.row, confidence };
    }
  }

  return {
    estimatedRank: Math.round(last.row.rank * getRankAdjustment(input.year)),
    target: last.row,
    confidence: 60,
  };
}
