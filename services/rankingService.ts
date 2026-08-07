import {
  RankingTarget,
  SAYISAL_2024,
  SAYISAL_2025,
  SAYISAL_2026,
} from "@/lib/constants/rankingTargets";

export interface TargetResult {
  tyt: number;
  ayt: number;
}

function interpolate(
  lower: RankingTarget,
  upper: RankingTarget,
  rank: number
): TargetResult {
  const ratio =
    (rank - lower.rank) /
    (upper.rank - lower.rank);

  return {
    tyt: Number(
      (
        lower.tyt +
        (upper.tyt - lower.tyt) * ratio
      ).toFixed(1)
    ),

    ayt: Number(
      (
        lower.ayt +
        (upper.ayt - lower.ayt) * ratio
      ).toFixed(1)
    ),
  };
}

function calculateFromTable(
  table: RankingTarget[],
  rank: number
): TargetResult {
  if (rank <= table[0].rank) {
    return {
      tyt: table[0].tyt,
      ayt: table[0].ayt,
    };
  }

  if (rank >= table[table.length - 1].rank) {
    const last = table[table.length - 1];

    return {
      tyt: last.tyt,
      ayt: last.ayt,
    };
  }

  for (let i = 0; i < table.length - 1; i++) {
    const lower = table[i];
    const upper = table[i + 1];

    if (
      rank >= lower.rank &&
      rank <= upper.rank
    ) {
      return interpolate(
        lower,
        upper,
        rank
      );
    }
  }

  return {
    tyt: table[0].tyt,
    ayt: table[0].ayt,
  };
}

export function calculateTarget(
  alan: string,
  rank: number,
  year = 2025
): TargetResult {
  switch (alan) {
    case "Sayısal":
      if (year === 2024)
        return calculateFromTable(
          SAYISAL_2024,
          rank
        );

      if (year === 2026)
        return calculateFromTable(
          SAYISAL_2026,
          rank
        );

      return calculateFromTable(
        SAYISAL_2025,
        rank
      );

    default:
      return calculateFromTable(
        SAYISAL_2025,
        rank
      );
  }
}