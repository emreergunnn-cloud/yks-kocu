"use client";

import {
  useMemo,
} from "react";

import type {
  StudyTask,
} from "@/types/studyPlan";

import {
  usePendingStudyTaskIds,
} from "./usePendingStudyTaskIds";

export function useVisibleStudyPlan(
  uid: string | null,
  studyPlan: StudyTask[]
) {
  const {
    pendingTaskIds,
    loading,
  } =
    usePendingStudyTaskIds(uid);

  const tasks = useMemo(
    () =>
      studyPlan.filter(
        (task) =>
          !pendingTaskIds.has(
            task.id
          )
      ),
    [
      studyPlan,
      pendingTaskIds,
    ]
  );

  const totals = useMemo(
    () =>
      tasks.reduce(
        (result, task) => ({
          minutes:
            result.minutes +
            task.durationMinutes,

          questions:
            result.questions +
            task.questionCount,
        }),
        {
          minutes: 0,
          questions: 0,
        }
      ),
    [tasks]
  );

  return {
    tasks,
    loading,

    minutes:
      totals.minutes,

    questions:
      totals.questions,

    hasAssigned:
      tasks.length !==
      studyPlan.length,
  };
}