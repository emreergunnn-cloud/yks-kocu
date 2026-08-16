"use client";

import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  AlanOption,
} from "@/types/user";

import {
  StudyPlanCalendarModeButtons,
} from "./calendar/StudyPlanCalendarModeButtons";

import {
  StudyPlanCalendarSaveButton,
} from "./calendar/StudyPlanCalendarSaveButton";

import {
  StudyPlanCalendarStatus,
} from "./calendar/StudyPlanCalendarStatus";

import {
  StudyPlanCalendarDatePicker,
} from "./calendar/StudyPlanCalendarDatePicker";

import {
  useStudyPlanCalendarActions,
} from "./calendar/useStudyPlanCalendarActions";

interface Props {
  uid: string;

  tasks:
    StudyTask[];

  dailyHours: number;

  alan:
    AlanOption | "";
}

export function StudyPlanCalendarActions(
  props: Props
) {
  const calendar =
    useStudyPlanCalendarActions(
      props
    );

  return (
    <div className="rounded-2xl border bg-white p-4 dark:bg-slate-900">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">
            Planı programa
            dönüştür
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Ödevlerini uygun
            bir tarihe takvimine
            aktar.
          </p>
        </div>

        <StudyPlanCalendarModeButtons
          mode={calendar.mode}
          disabled={
            calendar.saving
          }
          onChange={
            calendar.changeMode
          }
        />

        <StudyPlanCalendarDatePicker
          mode={calendar.mode}
          value={
            calendar.selectedDate
          }
          busyDates={
            calendar.busyDates
          }
          loading={
            calendar
              .availabilityLoading
          }
          disabled={
            calendar.saving
          }
          onChange={
            calendar.changeDate
          }
        />

        <StudyPlanCalendarSaveButton
          saving={
            calendar.saving
          }
          saved={
            calendar.saved
          }
          disabled={
            calendar.saving ||
            calendar
              .availabilityLoading ||
            !calendar
              .dateAvailable ||
            !props.tasks.length
          }
          onClick={() =>
            void calendar.save()
          }
        />

        <StudyPlanCalendarStatus
          mode={calendar.mode}
          minutes={
            calendar
              .totalDailyMinutes
          }
          error={
            calendar.error
          }
        />
      </div>
    </div>
  );
}