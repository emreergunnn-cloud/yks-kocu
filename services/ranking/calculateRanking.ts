import type { RankingTarget } from "@/lib/constants/rankingTargets";
import type { RankingCalculatorResult } from "./types";
import { getAytNet, getTytNet, interpolate } from "./utils";

export function calculateRanking(targets: RankingTarget[], tytNet: number, aytNet: number): RankingCalculatorResult {
  if (!targets.length) return { ranking: 0, tytNet, aytNet };
  const totalNet = tytNet + aytNet;
  const sorted = [...targets].sort(
    (a, b) => getTytNet(a) + getAytNet(a) - (getTytNet(b) + getAytNet(b))
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const firstTotal = getTytNet(first) + getAytNet(first);
  const lastTotal = getTytNet(last) + getAytNet(last);

  if (totalNet >= firstTotal) return { ranking: first.rank, tytNet, aytNet };
  if (totalNet <= lastTotal) return { ranking: last.rank, tytNet, aytNet };

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const upper = sorted[i];
    const lower = sorted[i + 1];
    const upperTotal = getTytNet(upper) + getAytNet(upper);
    const lowerTotal = getTytNet(lower) + getAytNet(lower);
    if (totalNet <= upperTotal && totalNet >= lowerTotal) {
      const ratio = upperTotal === lowerTotal ? 0 : (totalNet - lowerTotal) / (upperTotal - lowerTotal);
      return interpolate(lower, upper, ratio);
    }
  }
  return { ranking: last.rank, tytNet, aytNet };
}
