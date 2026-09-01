import type { RankingCalculatorResult } from "./types";
import { getRankingTargets } from "./targetLookup";
import { getAytNet, getTytNet } from "./utils";

export function calculateTarget(alan: string, targetRanking: number, year: number): RankingCalculatorResult {
  const targets = getRankingTargets(alan, year);
  if (!targets.length) return { ranking: targetRanking, tytNet: 0, aytNet: 0 };

  const sorted = [...targets].sort((a, b) => a.rank - b.rank);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (targetRanking <= first.rank) {
    return { ranking: targetRanking, tytNet: getTytNet(first), aytNet: getAytNet(first) };
  }
  if (targetRanking >= last.rank) {
    return { ranking: targetRanking, tytNet: getTytNet(last), aytNet: getAytNet(last) };
  }

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const better = sorted[i];
    const worse = sorted[i + 1];
    if (targetRanking >= better.rank && targetRanking <= worse.rank) {
      const ratio = worse.rank === better.rank ? 0 : (targetRanking - better.rank) / (worse.rank - better.rank);
      const betterTyt = getTytNet(better);
      const worseTyt = getTytNet(worse);
      const betterAyt = getAytNet(better);
      const worseAyt = getAytNet(worse);
      return {
        ranking: targetRanking,
        tytNet: Number((betterTyt + (worseTyt - betterTyt) * ratio).toFixed(1)),
        aytNet: Number((betterAyt + (worseAyt - betterAyt) * ratio).toFixed(1)),
      };
    }
  }
  return { ranking: targetRanking, tytNet: getTytNet(last), aytNet: getAytNet(last) };
}
