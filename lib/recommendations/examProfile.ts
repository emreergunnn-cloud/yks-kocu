import type { ExamResult } from "@/types/exam";
import type { UserProfile } from "@/types/user";
import type {
  NetTrend,
  RecommendationExam,
} from "@/types/recommendation";

export function getLatestExam(
  exams: ExamResult[],
  scope: RecommendationExam
) {
  return exams.find((exam) => {
    if (scope === "TYT") {
      return (
        exam.denemeTipi === "TYT" ||
        exam.denemeTipi === "TYT+AYT"
      );
    }

    return (
      exam.denemeTipi === "AYT" ||
      exam.denemeTipi === "TYT+AYT"
    );
  });
}

export function buildNetTrend(
  profile: UserProfile | null,
  exams: ExamResult[],
  scope: RecommendationExam
): NetTrend {
  const latest = getLatestExam(exams, scope);

  const initial =
    scope === "TYT"
      ? profile?.currentTYT ?? 0
      : profile?.currentAYT ?? 0;

  const current =
    scope === "TYT"
      ? latest?.tytToplamNet ?? initial
      : latest?.aytToplamNet ?? initial;

  const target =
    scope === "TYT"
      ? profile?.targetTYT ?? current
      : profile?.targetAYT ?? current;

  return {
    initial,
    current,
    target,
    delta: current - initial,
    gap: Math.max(0, target - current),
  };
}