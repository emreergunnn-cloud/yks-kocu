// rankingCalculator.ts

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

function getTable(alan: string, year: number): RankingTarget[] {
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

function interpolateRank(
  target: number,
  upperRank: number,
  lowerRank: number,
  upperValue: number,
  lowerValue: number
) {
  if (upperValue === lowerValue) return upperRank;

  const ratio =
    (target - lowerValue) /
    (upperValue - lowerValue);

  return Math.round(
    lowerRank - ((lowerRank - upperRank) * ratio)
  );
}

export function calculateEstimatedRanking(
  input: RankingCalculatorInput
): RankingCalculatorResult {

  const table = getTable(input.alan, input.year);

  if (!table.length)
    return {
      estimatedRank: 0,
      target: null,
      confidence: 0,
    };

  let tytWeight = 0.40;
  let aytWeight = 0.60;

  switch (input.alan) {
    case "Eşit Ağırlık":
      tytWeight = 0.45;
      aytWeight = 0.55;
      break;

    case "Sözel":
      tytWeight = 0.50;
      aytWeight = 0.50;
      break;

    case "Dil":
      tytWeight = 0.35;
      aytWeight = 0.65;
      break;
  }

  let weightedNet =
    input.tyt * tytWeight +
    input.ayt * aytWeight +
    (input.obp - 50) * 0.04;

  switch (input.year) {
    case 2024:
      weightedNet *= 1.00;
      break;

    case 2025:
      weightedNet *= 0.985;
      break;

    case 2026:
      weightedNet *= 0.965;
      break;
  }

  const weightedTable = table.map((row) => {

    let weighted =
      ((row.tytMin + row.tytMax) / 2) * tytWeight +
      ((row.aytMin + row.aytMax) / 2) * aytWeight +
      30 * 0.04;

    switch (input.year) {
      case 2025:
        weighted *= 0.985;
        break;

      case 2026:
        weighted *= 0.965;
        break;
    }

    return {
      row,
      tyt: (row.tytMin + row.tytMax) / 2,
      ayt: (row.aytMin + row.aytMax) / 2,
      weighted,
    };
  });
    if (weightedNet >= weightedTable[0].weighted) {
    return {
      estimatedRank: weightedTable[0].row.rank,
      target: weightedTable[0].row,
      confidence: 99,
    };
  }

  const last = weightedTable[weightedTable.length - 1];

  if (weightedNet <= last.weighted) {
    return {
      estimatedRank: last.row.rank,
      target: last.row,
      confidence: 60,
    };
  }

  for (let i = 0; i < weightedTable.length - 1; i++) {
    const upper = weightedTable[i];
    const lower = weightedTable[i + 1];

    if (
      weightedNet <= upper.weighted &&
      weightedNet >= lower.weighted
    ) {

      let estimatedRank = interpolateRank(
        weightedNet,
        upper.row.rank,
        lower.row.rank,
        upper.weighted,
        lower.weighted
      );

      // Gerçek YKS verilerine yaklaşması için düzeltme
      switch (input.year) {

        case 2024:
          estimatedRank = Math.round(estimatedRank * 1.00);
          break;

        case 2025:
          estimatedRank = Math.round(estimatedRank * 1.10);
          break;

        case 2026:
          estimatedRank = Math.round(estimatedRank * 1.22);
          break;

      }

      const tytDiff = Math.abs(input.tyt - upper.tyt);
      const aytDiff = Math.abs(input.ayt - upper.ayt);

      const diff =
        tytDiff * 0.45 +
        aytDiff * 0.55;

      const confidence = Math.round(
        Math.max(
          55,
          Math.min(
            99,
            99 - diff * 2.2
          )
        )
      );

      return {
        estimatedRank,
        target: upper.row,
        confidence,
      };
    }
  }

  return {
    estimatedRank: Math.round(last.row.rank * (
      input.year === 2026
        ? 1.22
        : input.year === 2025
        ? 1.10
        : 1
    )),
    target: last.row,
    confidence: 60,
  };
}