import type {
  SubjectProgressMap,
} from "@/services/topicService";

import type {
  StudyTaskProgressMap,
} from "@/types/studyTaskProgress";

import type {
  AlanOption,
} from "@/types/user";

import type {
  StudyTask,
  WeeklyStudyPlanDay,
} from "@/types/studyPlan";

import {
  getStudyPlanCandidates,
} from "./candidateGenerator";

import {
  getQuestionCount,
} from "./questionCalculator";

interface Options {
  progressMap:
    SubjectProgressMap;

  dailyHours: number;

  alan?:
    AlanOption | "";

  days?: number;

  taskProgress?:
    StudyTaskProgressMap;

  excludedTaskIds?:
    ReadonlySet<string>;
}

export function generateWeeklyStudyPlan({
  progressMap,
  dailyHours,
  alan = "",
  days = 7,
  taskProgress = {},
  excludedTaskIds =
    new Set<string>(),
}: Options): WeeklyStudyPlanDay[] {
  const targetMinutes =
    Math.round(
      dailyHours * 60
    );

  if (targetMinutes <= 0) {
    return [];
  }

  const candidates =
    getStudyPlanCandidates(
      progressMap,
      alan,
      taskProgress,
      excludedTaskIds
    );

  const usedIds =
    new Set<string>();

  const week:
    WeeklyStudyPlanDay[] = [];

  for (
    let dayIndex = 0;
    dayIndex < days;
    dayIndex++
  ) {
    let remaining =
      targetMinutes;

    const tasks:
      StudyTask[] = [];

    for (
      const candidate
      of candidates
    ) {
      if (
        remaining < 25 ||
        tasks.length >= 8
      ) {
        break;
      }

      if (
        usedIds.has(
          candidate.id
        )
      ) {
        continue;
      }

      const duration =
        Math.min(
          candidate.durationMinutes,
          remaining
        );

      if (duration < 25) {
        continue;
      }

      tasks.push({
        ...candidate,

        durationMinutes:
          duration,

        questionCount:
          getQuestionCount(
            duration,
            candidate.type
          ),
      });

      usedIds.add(
        candidate.id
      );

      remaining -=
        duration;
    }

    week.push({
      dayIndex,
      tasks,

      totalMinutes:
        tasks.reduce(
          (total, task) =>
            total +
            task.durationMinutes,
          0
        ),
    });

    if (
      usedIds.size >=
      candidates.length
    ) {
      break;
    }
  }

  return week;
}
