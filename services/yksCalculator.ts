import {
  ExamResult,
  SectionScore,
  RankingEstimate,
  CalculatedExamResult,
} from "@/types/exam";

interface RankingRow {
  rank: number;
  tyt: number;
  ayt: number;
}

type AlanType =
  | "Sayısal"
  | "Eşit Ağırlık"
  | "Sözel"
  | "Dil";

const round = (v: number) => Number(v.toFixed(2));

function isSectionScore(
  value: SectionScore | number | undefined
): value is SectionScore {
  return (
    typeof value === "object" &&
    value !== null &&
    "net" in value
  );
}

function getNet(
  value: SectionScore | number | undefined
): number {
  if (value === undefined) return 0;

  if (typeof value === "number") return value;

  if (isSectionScore(value)) return value.net;

  return 0;
}

export function calculateTYTNet(
  exam: ExamResult
): number {
  return round(
    getNet(exam.tytTurkce) +
      getNet(exam.tytSosyal) +
      getNet(exam.tytMat) +
      getNet(exam.tytFen)
  );
}

export function calculateAYTNet(
  exam: ExamResult
): number {
  return round(
    getNet(exam.aytMat) +
      getNet(exam.aytFizik) +
      getNet(exam.aytKimya) +
      getNet(exam.aytBiyoloji) +
      getNet(exam.aytEdebiyat) +
      getNet(exam.aytTarih1) +
      getNet(exam.aytCografya1) +
      getNet(exam.aytTarih2) +
      getNet(exam.aytCografya2) +
      getNet(exam.aytFelsefe) +
      getNet(exam.aytDin) +
      getNet(exam.aytDil)
  );
}

const TABLE_2024: RankingRow[] = [
  { rank: 1000, tyt: 109, ayt: 73 },
  { rank: 2500, tyt: 106, ayt: 70 },
  { rank: 5000, tyt: 103, ayt: 67 },
  { rank: 7500, tyt: 101, ayt: 65 },
  { rank: 10000, tyt: 99, ayt: 63 },
  { rank: 15000, tyt: 96, ayt: 60 },
  { rank: 20000, tyt: 94, ayt: 58 },
  { rank: 30000, tyt: 90, ayt: 54 },
  { rank: 40000, tyt: 87, ayt: 51 },
  { rank: 50000, tyt: 84, ayt: 49 },
  { rank: 60000, tyt: 82, ayt: 47 },
  { rank: 70000, tyt: 80, ayt: 45 },
  { rank: 80000, tyt: 78, ayt: 43 },
  { rank: 90000, tyt: 76, ayt: 41 },
  { rank: 100000, tyt: 74, ayt: 39 },
  { rank: 125000, tyt: 70, ayt: 35 },
  { rank: 150000, tyt: 67, ayt: 32 },
  { rank: 175000, tyt: 64, ayt: 30 },
  { rank: 200000, tyt: 61, ayt: 28 },
];

const TABLE_2025: RankingRow[] = [
  { rank: 1000, tyt: 108, ayt: 72 },
  { rank: 2500, tyt: 105, ayt: 69 },
  { rank: 5000, tyt: 102, ayt: 66 },
  { rank: 7500, tyt: 100, ayt: 64 },
  { rank: 10000, tyt: 98, ayt: 62 },
  { rank: 15000, tyt: 95, ayt: 59 },
  { rank: 20000, tyt: 93, ayt: 57 },
  { rank: 30000, tyt: 89, ayt: 53 },
  { rank: 40000, tyt: 86, ayt: 50 },
  { rank: 50000, tyt: 83, ayt: 48 },
  { rank: 60000, tyt: 81, ayt: 46 },
  { rank: 70000, tyt: 79, ayt: 44 },
  { rank: 80000, tyt: 77, ayt: 42 },
  { rank: 90000, tyt: 75, ayt: 40 },
  { rank: 100000, tyt: 73, ayt: 38 },
  { rank: 125000, tyt: 69, ayt: 34 },
  { rank: 150000, tyt: 66, ayt: 31 },
  { rank: 175000, tyt: 63, ayt: 29 },
  { rank: 200000, tyt: 60, ayt: 27 },
];

const TABLE_2026: RankingRow[] = [
  { rank: 1000, tyt: 108, ayt: 72 },
  { rank: 2500, tyt: 105, ayt: 69 },
  { rank: 5000, tyt: 102, ayt: 66 },
  { rank: 7500, tyt: 100, ayt: 64 },
  { rank: 10000, tyt: 98, ayt: 62 },
  { rank: 15000, tyt: 95, ayt: 59 },
  { rank: 20000, tyt: 93, ayt: 57 },
  { rank: 30000, tyt: 89, ayt: 53 },
  { rank: 40000, tyt: 86, ayt: 50 },
  { rank: 50000, tyt: 83, ayt: 48 },
  { rank: 60000, tyt: 81, ayt: 46 },
  { rank: 70000, tyt: 79, ayt: 44 },
  { rank: 80000, tyt: 77, ayt: 42 },
  { rank: 90000, tyt: 75, ayt: 40 },
  { rank: 100000, tyt: 73, ayt: 38 },
  { rank: 125000, tyt: 69, ayt: 34 },
  { rank: 150000, tyt: 66, ayt: 31 },
  { rank: 175000, tyt: 63, ayt: 29 },
  { rank: 200000, tyt: 60, ayt: 27 },
];
function interpolateRank(
  targetNet: number,
  upperRank: number,
  lowerRank: number,
  upperNet: number,
  lowerNet: number
): number {
  const ratio =
    (targetNet - lowerNet) /
    (upperNet - lowerNet);

  return Math.round(
    lowerRank -
      (lowerRank - upperRank) * ratio
  );
}

function estimateRanking(
  tytNet: number,
  aytNet: number,
  obp: number,
  table: RankingRow[],
  alan: AlanType
): number {
  let weightedNet = 0;

switch (alan) {
  case "Sayısal":
    weightedNet =
      tytNet * 0.4 +
      aytNet * 0.6;
    break;

  case "Eşit Ağırlık":
    weightedNet =
      tytNet * 0.45 +
      aytNet * 0.55;
    break;

  case "Sözel":
    weightedNet =
      tytNet * 0.5 +
      aytNet * 0.5;
    break;

  case "Dil":
    weightedNet =
      tytNet * 0.35 +
      aytNet * 0.65;
    break;
}

weightedNet += (obp - 50) * 0.04;

  const weightedTable = table.map((item) => {
  let weighted = 0;

  switch (alan) {
    case "Sayısal":
      weighted = item.tyt * 0.4 + item.ayt * 0.6;
      break;

    case "Eşit Ağırlık":
      weighted = item.tyt * 0.45 + item.ayt * 0.55;
      break;

    case "Sözel":
      weighted = item.tyt * 0.5 + item.ayt * 0.5;
      break;

    case "Dil":
      weighted = item.tyt * 0.35 + item.ayt * 0.65;
      break;
  }

  weighted += 30 * 0.04;

  return {
    rank: item.rank,
    weighted,
  };
});

  if (weightedNet >= weightedTable[0].weighted) {
    return weightedTable[0].rank;
  }

  const last =
    weightedTable[weightedTable.length - 1];

  if (weightedNet <= last.weighted) {
    return last.rank;
  }

  for (let i = 0; i < weightedTable.length - 1; i++) {
    const upper = weightedTable[i];
    const lower = weightedTable[i + 1];

    if (
      weightedNet <= upper.weighted &&
      weightedNet >= lower.weighted
    ) {
      return interpolateRank(
        weightedNet,
        upper.rank,
        lower.rank,
        upper.weighted,
        lower.weighted
      );
    }
  }

  return last.rank;
}

function calculateRankingEstimates(
  tytNet: number,
  aytNet: number,
  obp: number,
  alan: AlanType
): RankingEstimate[] {
  return [
    {
      year: 2024,
      siralama: estimateRanking(
  tytNet,
  aytNet,
  obp,
  TABLE_2024,
  alan
),
    },
    {
      year: 2025,
      siralama: estimateRanking(
  tytNet,
  aytNet,
  obp,
  TABLE_2025,
  alan
),
    },
    {
      year: 2026,
      siralama: estimateRanking(
  tytNet,
  aytNet,
  obp,
  TABLE_2026,
  alan
),
    },
  ];
}

export function calculateExamResult(
  exam: ExamResult,
  alan: AlanType,
  obp = 80
): CalculatedExamResult {
  const tytNet =
    calculateTYTNet(exam);

  const aytNet =
    calculateAYTNet(exam);

  const estimates =
  calculateRankingEstimates(
    tytNet,
    aytNet,
    obp,
    alan
  );

  return {
  tytNet,
  aytNet,
  estimates,
};
}
export function getBestEstimate(
  result: CalculatedExamResult
): RankingEstimate {
  return result.estimates.reduce((best, current) =>
    current.siralama < best.siralama
      ? current
      : best
  );
}

export function getWorstEstimate(
  result: CalculatedExamResult
): RankingEstimate {
  return result.estimates.reduce((worst, current) =>
    current.siralama > worst.siralama
      ? current
      : worst
  );
}

export function getAverageRanking(
  result: CalculatedExamResult
): number {
  const total = result.estimates.reduce(
    (sum, item) => sum + item.siralama,
    0
  );

  return Math.round(
    total / result.estimates.length
  );
}

export function getYearEstimate(
  result: CalculatedExamResult,
  year: 2024 | 2025 | 2026
): RankingEstimate {
  return (
    result.estimates.find(
      (e) => e.year === year
    ) ?? result.estimates[0]
  );
}

export function getRankingDifference(
  result: CalculatedExamResult
) {
  const values = result.estimates.map(
    (e) => e.siralama
  );

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    difference:
      Math.max(...values) -
      Math.min(...values),
  };
}

export function getWeightedNet(
  tytNet: number,
  aytNet: number
): number {
  return Number(
    (tytNet * 0.4 + aytNet * 0.6).toFixed(2)
  );
}

export function isTargetReached(
  currentTYT: number,
  currentAYT: number,
  targetTYT: number,
  targetAYT: number
): boolean {
  return (
    currentTYT >= targetTYT &&
    currentAYT >= targetAYT
  );
}