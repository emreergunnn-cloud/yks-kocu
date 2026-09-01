import type { CalculatedExamResult, ExamResult } from "@/types/exam";
import { calculateAYTNet, calculateTYTNet } from "./yksCalculator/netCalculator";
import { calculateRankingEstimates } from "./yksCalculator/rankingEstimator";
import type { AlanType } from "./yksCalculator/types";

export { calculateAYTNet, calculateTYTNet } from "./yksCalculator/netCalculator";
export {
  getAverageRanking,
  getBestEstimate,
  getRankingDifference,
  getWeightedNet,
  getWorstEstimate,
  getYearEstimate,
  isTargetReached,
} from "./yksCalculator/resultUtils";

export function calculateExamResult(exam: ExamResult, alan: AlanType, obp = 80): CalculatedExamResult {
  const tytNet = calculateTYTNet(exam);
  const aytNet = calculateAYTNet(exam);
  return { tytNet, aytNet, estimates: calculateRankingEstimates(tytNet, aytNet, obp, alan) };
}
