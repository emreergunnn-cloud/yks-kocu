import type {
  StudyTaskResultSummary,
} from "@/types/studyTaskProgress";

interface Options {
  assignedQuestions: number;
  solvedQuestions: number;
  correct: number;
  wrong: number;
}

export function calculateStudyTaskResult({
  assignedQuestions,
  solvedQuestions,
  correct,
  wrong,
}: Options): StudyTaskResultSummary {
  const blank = Math.max(
    0,
    solvedQuestions - correct - wrong
  );

  const remainingQuestions = Math.max(
    0,
    assignedQuestions - solvedQuestions
  );

  const accuracy =
    solvedQuestions > 0
      ? correct / solvedQuestions
      : 0;

  return {
    assignedQuestions,
    solvedQuestions,
    correct,
    wrong,
    blank,
    remainingQuestions,
    accuracy,
  };
}