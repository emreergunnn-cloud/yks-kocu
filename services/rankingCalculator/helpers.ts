import type { RankingTarget } from "@/lib/constants/rankingTargets";
import type { RankingCalculatorInput } from "./types";
import { getWeights, getYearDifficulty } from "./weights";

export function interpolateRank(target: number, upperRank: number, lowerRank: number, upperValue: number, lowerValue: number) {
  if (upperValue === lowerValue) return upperRank;
  const ratio = (target - lowerValue) / (upperValue - lowerValue);
  return Math.round(lowerRank - (lowerRank - upperRank) * ratio);
}

export function buildWeightedTable(table: RankingTarget[], input: RankingCalculatorInput) {
  const weights = getWeights(input.alan);
  const difficulty = getYearDifficulty(input.year);
  return table.map((row) => {
    const tyt = (row.tytMin + row.tytMax) / 2;
    const ayt = (row.aytMin + row.aytMax) / 2;
    const weighted = (tyt * weights.tyt + ayt * weights.ayt + 30 * 0.04) * difficulty;
    return { row, tyt, ayt, weighted };
  });
}

export function getInputWeightedNet(input: RankingCalculatorInput) {
  const weights = getWeights(input.alan);
  return (input.tyt * weights.tyt + input.ayt * weights.ayt + (input.obp - 50) * 0.04) * getYearDifficulty(input.year);
}
