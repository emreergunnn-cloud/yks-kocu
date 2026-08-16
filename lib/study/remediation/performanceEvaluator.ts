import type {
  StudyRemediation,
} from "@/types/remediation";

import type {
  StudyTaskProgress,
} from "@/types/studyTaskProgress";

export function evaluateRemediation(
  progress:
    StudyTaskProgress | undefined
): StudyRemediation | undefined {
  if (
    !progress ||
    progress.attemptCount <= 0
  ) {
    return undefined;
  }

  const accuracy =
    progress.accuracy;

  const hasRemaining =
    progress.remainingQuestions > 0;

  if (
    accuracy >= 0.9 &&
    !hasRemaining
  ) {
    return undefined;
  }

  const level =
    accuracy < 0.7
      ? "intensive"
      : "review";

  return {
    level,

    accuracy,

    solvedQuestions:
      progress.lastSolvedQuestions,

    wrongQuestions:
      progress.lastWrong,

    remainingQuestions:
      progress.remainingQuestions,

    message:
      level === "intensive"
        ? "Bu konuda hata oranı hâlâ yüksek. Yeni takviyeden önce konuyu farklı bir anlatımla tekrar çalış."
        : "Konu gelişiyor ancak henüz tam oturmadı. Kısa tekrar ve örnek soru çalışması öneriyoruz.",
  };
}