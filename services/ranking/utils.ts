import type { RankingTarget } from "@/lib/constants/rankingTargets";
import type { RankingCalculatorResult } from "./types";

export function getTytNet(target: RankingTarget): number {
  return Number(((target.tytMin + target.tytMax) / 2).toFixed(1));
}

export function getAytNet(target: RankingTarget): number {
  return Number(((target.aytMin + target.aytMax) / 2).toFixed(1));
}

export function interpolate(lower: RankingTarget, upper: RankingTarget, ratio: number): RankingCalculatorResult {
  const lowerTyt = getTytNet(lower);
  const upperTyt = getTytNet(upper);
  const lowerAyt = getAytNet(lower);
  const upperAyt = getAytNet(upper);
  return {
    ranking: Math.round(lower.rank + (upper.rank - lower.rank) * ratio),
    tytNet: Number((lowerTyt + (upperTyt - lowerTyt) * ratio).toFixed(1)),
    aytNet: Number((lowerAyt + (upperAyt - lowerAyt) * ratio).toFixed(1)),
  };
}
