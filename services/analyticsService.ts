import type { ExamResult, SectionScore } from "@/types/exam";
import type { UserProfile } from "@/types/user";
import { buildExamMetrics, buildTrendData, sortExams } from "./analytics/examMetrics";
import { buildSectionAverages } from "./analytics/sectionMetrics";
import { calculateTargetProgress, estimateTargetNet } from "./analytics/targetMetrics";
import type { AnalyticsSummary } from "./analytics/types";

export type { AnalyticsSummary, SectionAverage, TrendPoint } from "./analytics/types";

export function getSectionNet(value: SectionScore | number | undefined) {
  if (value === undefined || value === null) return 0;
  return typeof value === "number" ? value : value.net ?? 0;
}

export function computeAnalyticsSummary(
  exams: ExamResult[],
  userProfile: UserProfile | null
): AnalyticsSummary {
  const sortedExams = sortExams(exams ?? []);
  const metrics = buildExamMetrics(sortedExams);
  const estimatedTargetNet = estimateTargetNet(userProfile);

  return {
    ...metrics,
    trendData: buildTrendData(sortedExams),
    sectionAverages: buildSectionAverages(sortedExams, userProfile?.alan ?? ""),
    estimatedTargetNet,
    targetProgressPercentage: calculateTargetProgress(
      userProfile,
      metrics.latestTytNet,
      metrics.latestAytNet,
      estimatedTargetNet
    ),
  };
}
