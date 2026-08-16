"use client";

import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  AlanOption,
} from "@/types/user";

import {
  StudyDurationSelector,
} from "./StudyDurationSelector";

import {
  StudyPlanSummary,
} from "./StudyPlanSummary";

import {
  StudyPlanEmptyState,
} from "./StudyPlanEmptyState";

import {
  StudyPlanCalendarActions,
} from "./StudyPlanCalendarActions";

import {
  StudyPlanTaskListWithResources,
} from "./recommendations/StudyPlanTaskListWithResources";

interface Props {
  dailyHours: number;

  setDailyHours:
    (value: number) => void;

  studyPlan:
    StudyTask[];

  totalMinutes: number;

  totalQuestions: number;

  uid:
    string | null;

  alan:
    AlanOption | "";
}

export function StudyPlannerToday({
  dailyHours,
  setDailyHours,
  studyPlan,
  totalMinutes,
  totalQuestions,
  uid,
  alan,
}: Props) {
  return (
    <div className="space-y-4">
      <StudyDurationSelector
        hours={dailyHours}
        onChange={
          setDailyHours
        }
      />

      <StudyPlanSummary
        minutes={
          totalMinutes
        }
        topics={
          studyPlan.length
        }
        questions={
          totalQuestions
        }
      />

      {studyPlan.length === 0 ? (
        <StudyPlanEmptyState />
      ) : (
        <>
          <StudyPlanTaskListWithResources
            uid={uid}
            tasks={
              studyPlan
            }
          />

          {uid && (
            <StudyPlanCalendarActions
              uid={uid}
              tasks={
                studyPlan
              }
              dailyHours={
                dailyHours
              }
              alan={alan}
            />
          )}
        </>
      )}
    </div>
  );
}