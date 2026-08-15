import type {
  GeneratePlanOptions,
  StudyTask,
} from "@/types/studyPlan";

import {
  getStudyPlanCandidates,
} from "./candidateGenerator";

import {
  getQuestionCount,
} from "./questionCalculator";

export {
  getStudyPlanCandidates,
} from "./candidateGenerator";

export function generateStudyPlan({
  progressMap,
  dailyHours,
  alan = "",
}: GeneratePlanOptions): StudyTask[] {
  let remaining = Math.max(
    0,
    Math.round(dailyHours * 60)
  );

  if (remaining <= 0) {
    return [];
  }

  const candidates =
    getStudyPlanCandidates(progressMap, alan);

  const selected: StudyTask[] = [];

  for (const task of candidates) {
    if (remaining < 25 || selected.length >= 8) {
      break;
    }

    const duration = Math.min(
      task.durationMinutes,
      remaining
    );

    selected.push({
      ...task,
      durationMinutes: duration,
      questionCount: getQuestionCount(
        duration,
        task.type
      ),
    });

    remaining -= duration;
  }

  return selected;
}