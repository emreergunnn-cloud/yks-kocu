import type {
  NetTrend,
  RecommendationExam,
  RecommendationLevel,
} from "@/types/recommendation";

interface Options {
  trend:
    NetTrend;

  exam:
    RecommendationExam;

  sectionRatio:
    number | null;

  recentOverallRatio:
    number | null;
}

export function calculateResourceLevel({
  trend,
  exam,
  sectionRatio,
  recentOverallRatio,
}: Options): RecommendationLevel {
  const examMax =
    exam === "TYT"
      ? 120
      : 80;

  const currentRatio =
    clamp(
      trend.current /
        examMax
    );

  const overallRatio =
    recentOverallRatio ??
    currentRatio;

  let score =
    calculateBaseScore(
      sectionRatio,
      overallRatio,
      currentRatio
    );

  score +=
    getProgressAdjustment(
      trend.delta /
        examMax
    );

  score +=
    getTargetAdjustment(
      trend.gap /
        examMax
    );

  if (score < 0.4) {
    return "beginner";
  }

  if (score < 0.72) {
    return "intermediate";
  }

  return "advanced";
}

function calculateBaseScore(
  sectionRatio: number | null,
  overallRatio: number,
  currentRatio: number
) {
  if (
    sectionRatio === null
  ) {
    return (
      overallRatio * 0.75 +
      currentRatio * 0.25
    );
  }

  return (
    sectionRatio * 0.6 +
    overallRatio * 0.25 +
    currentRatio * 0.15
  );
}

function getProgressAdjustment(
  ratio: number
) {
  if (ratio >= 0.1) {
    return 0.06;
  }

  if (ratio >= 0.05) {
    return 0.03;
  }

  if (ratio <= -0.05) {
    return -0.06;
  }

  return 0;
}

function getTargetAdjustment(
  ratio: number
) {
  if (ratio >= 0.35) {
    return -0.04;
  }

  if (ratio <= 0.1) {
    return 0.03;
  }

  return 0;
}

function clamp(
  value: number
) {
  return Math.max(
    0,
    Math.min(1, value)
  );
}