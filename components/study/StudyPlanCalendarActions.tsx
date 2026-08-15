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
  useStudyPlanCalendarActions,
} from "./calendar/useStudyPlanCalendarActions";

interface Props {
  uid: string;
  tasks: StudyTask[];
  dailyHours: number;
  alan: AlanOption | "";
}

export function StudyPlanCalendarActions(props: Props) {
  const calendar =
    useStudyPlanCalendarActions(props);

  return (
    <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold">
            Planı programa dönüştür
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Günlük veya haftalık çalışma programını takvimine aktar.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StudyPlanCalendarModeButtons
            mode={calendar.mode}
            disabled={calendar.saving}
            onChange={calendar.changeMode}
          />

          <StudyPlanCalendarSaveButton
            saving={calendar.saving}
            saved={calendar.saved}
            disabled={calendar.saving || !props.tasks.length}
            onClick={() => void calendar.save()}
          />
        </div>
      </div>

      <StudyPlanCalendarStatus
        mode={calendar.mode}
        minutes={calendar.totalDailyMinutes}
        error={calendar.error}
      />
    </div>
  );
}