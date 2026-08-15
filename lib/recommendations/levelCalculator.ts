import type {
  NetTrend,
  RecommendationExam,
  RecommendationLevel,
} from "@/types/recommendation";

interface Options {
  trend: NetTrend;
  exam: RecommendationExam;
  sectionRatio: number | null;
}

export function calculateResourceLevel({
  trend,
  exam,
  sectionRatio,
}: Options): RecommendationLevel {
  const examMax =
    exam === "TYT" ? 120 : 80;

  const overallRatio =
    trend.current / examMax;

  let score =
    sectionRatio === null
      ? overallRatio
      : sectionRatio * 0.65 +
        overallRatio * 0.35;

  const progressRatio =
    trend.delta / examMax;

  const gapRatio =
    trend.gap / examMax;

  if (progressRatio >= 0.1) {
    score += 0.03;
  }

  if (gapRatio >= 0.3) {
    score -= 0.04;
  }

  if (score < 0.38) {
    return "beginner";
  }

  if (score < 0.72) {
    return "intermediate";
  }

  return "advanced";
}