import type {
  StudyTaskProgress,
  StudyTaskResultSummary,
} from "@/types/studyTaskProgress";

import type {
  TopicStatus,
} from "@/types/topic";

interface ResultEvidence {
  accuracy: number;
  solvedQuestions: number;
  remainingQuestions: number;
  attemptCount: number;
}

function deriveStatus({
  accuracy,
  solvedQuestions,
  remainingQuestions,
  attemptCount,
}: ResultEvidence): TopicStatus {
  if (solvedQuestions <= 0) {
    return "Çalışılıyor";
  }

  if (accuracy < 0.7) {
    return "Tekrar Edilecek";
  }

  const hasEnoughEvidence =
    solvedQuestions >= 15 ||
    attemptCount >= 2;

  if (
    accuracy >= 0.85 &&
    remainingQuestions === 0 &&
    hasEnoughEvidence
  ) {
    return "Tamamlandı";
  }

  return "Çalışılıyor";
}

export function deriveTopicStatusFromStudyResult(
  result: StudyTaskResultSummary,
  attemptCount: number
): TopicStatus {
  return deriveStatus({
    accuracy: result.accuracy,
    solvedQuestions: result.solvedQuestions,
    remainingQuestions: result.remainingQuestions,
    attemptCount,
  });
}

export function deriveTopicStatusFromTaskProgress(
  progress: StudyTaskProgress
): TopicStatus {
  return deriveStatus({
    accuracy: progress.accuracy,
    solvedQuestions: progress.lastSolvedQuestions,
    remainingQuestions: progress.remainingQuestions,
    attemptCount: progress.attemptCount,
  });
}
