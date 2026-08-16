import type {
  GeneratePlanOptions,
  StudyTask,
} from "@/types/studyPlan";

import {
  getStudyPlanCandidates,
} from "./candidateGenerator";

export function generateStudyPlan({
  progressMap,
  dailyHours,
  alan = "",
  taskProgress = {},
  excludedTaskIds =
    new Set<string>(),
}: GeneratePlanOptions):
  StudyTask[] {
  const availableMinutes =
    Math.max(
      0,
      Math.round(
        dailyHours * 60
      )
    );

  if (
    availableMinutes <= 0
  ) {
    return [];
  }

  const candidates =
    getStudyPlanCandidates(
      progressMap,
      alan,
      taskProgress,
      excludedTaskIds
    );

  const selected:
    StudyTask[] = [];

  let remaining =
    availableMinutes;

  for (
    const task
    of candidates
  ) {
    if (
      task.durationMinutes >
      remaining
    ) {
      continue;
    }

    selected.push(
      task
    );

    remaining -=
      task.durationMinutes;

    if (
      selected.length >= 8
    ) {
      break;
    }

    if (
      remaining < 15
    ) {
      break;
    }
  }

  return selected;
}

export {
  getStudyPlanCandidates,
};