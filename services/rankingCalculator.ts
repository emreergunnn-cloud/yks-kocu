import {
  SAYISAL_2024,
  SAYISAL_2025,
  SAYISAL_2026,
  EA_2024,
  EA_2025,
  EA_2026,
  SOZEL_2024,
  SOZEL_2025,
  SOZEL_2026,
  DIL_2024,
  DIL_2025,
  DIL_2026,
  RankingTarget,
} from "@/lib/constants/rankingTargets";

export interface RankingCalculatorInput {
  alan: "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil";

  year: 2024 | 2025 | 2026;

  tyt: number;

  ayt: number;

  obp: number;
}

export interface RankingCalculatorResult {
  estimatedRank: number;

  target: RankingTarget | null;

  confidence: number;
}

function getTable(
  alan: string,
  year: number
): RankingTarget[] {
  if (alan === "Sayısal") {
    if (year === 2024) return SAYISAL_2024;
    if (year === 2025) return SAYISAL_2025;
    return SAYISAL_2026;
  }

  if (alan === "Eşit Ağırlık") {
    if (year === 2024) return EA_2024;
    if (year === 2025) return EA_2025;
    return EA_2026;
  }

  if (alan === "Sözel") {
    if (year === 2024) return SOZEL_2024;
    if (year === 2025) return SOZEL_2025;
    return SOZEL_2026;
  }

  if (year === 2024) return DIL_2024;
  if (year === 2025) return DIL_2025;

  return DIL_2026;
}

export function calculateEstimatedRanking(
  input: RankingCalculatorInput
): RankingCalculatorResult {

  const table = getTable(
    input.alan,
    input.year
  );

  if (table.length === 0) {
    return {
      estimatedRank: 0,
      target: null,
      confidence: 0,
    };
  }

  let best = table[0];

  let bestScore = Number.MAX_VALUE;

  for (const row of table) {

    const centerTYT =
      (row.tytMin + row.tytMax) / 2;

    const centerAYT =
      (row.aytMin + row.aytMax) / 2;

    const diff =
      Math.abs(centerTYT - input.tyt) +
      Math.abs(centerAYT - input.ayt);

    if (diff < bestScore) {
      bestScore = diff;
      best = row;
    }
  }

  let confidence = Math.max(
    50,
    100 - bestScore * 3
  );

  if (input.obp >= 90) confidence += 3;
  else if (input.obp >= 80) confidence += 2;

  confidence = Math.min(99, confidence);

  return {
    estimatedRank: best.rank,

    target: best,

    confidence,
  };
}