import type {
  StudyTaskProgress,
} from "@/types/studyTaskProgress";

interface Result {
  score: number;
  confidencePoints: number;
}

export function applyTaskProgressScore(
  baseScore: number,
  progress?: StudyTaskProgress
): Result {
  if (!progress) {
    return {
      score: baseScore,
      confidencePoints: 0,
    };
  }

  const performanceScore = Math.round(
    progress.accuracy * 100
  );

  let score = baseScore > 0
    ? Math.round(
        performanceScore * 0.7 +
          baseScore * 0.3
      )
    : performanceScore;

  if (progress.remainingQuestions > 0) {
    score -= 5;
  }

  return {
    score,
    confidencePoints: 3,
  };
}
