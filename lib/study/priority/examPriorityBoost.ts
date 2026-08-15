import type {
  StudyTaskExamImpact,
} from "@/types/examImpact";

import type {
  StudyTaskType,
} from "@/types/studyPlan";

export function getExamPriorityBoost(
  impact:
    StudyTaskExamImpact | undefined,
  type: StudyTaskType
): number {
  if (!impact) {
    return 0;
  }

  if (type === "weak") {
    return {
      medium: 16,
      high: 34,
      "very-high": 48,
    }[impact.riskLevel];
  }

  if (type === "revision") {
    return {
      medium: 6,
      high: 14,
      "very-high": 20,
    }[impact.riskLevel];
  }

  return {
    medium: 3,
    high: 8,
    "very-high": 12,
  }[impact.riskLevel];
}