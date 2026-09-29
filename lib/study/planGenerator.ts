import type {
  GeneratePlanOptions,
  StudyTask,
} from "@/types/studyPlan";

import {
  getStudyPlanCandidates,
} from "./candidateGenerator";
import { isSchoolGrade } from "@/lib/constants/curriculum/config";
import { getSchoolStudyPlanCandidates } from "./school/schoolPlan";

export function generateStudyPlan({
  progressMap,
  dailyHours,
  alan = "",
  sinif = "",
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

  const candidates = isSchoolGrade(sinif)
    ? getSchoolStudyPlanCandidates(sinif, progressMap, taskProgress, excludedTaskIds)
    : getStudyPlanCandidates(progressMap, alan, taskProgress, excludedTaskIds, sinif);

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