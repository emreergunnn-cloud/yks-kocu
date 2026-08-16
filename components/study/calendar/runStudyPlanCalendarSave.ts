import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  AlanOption,
} from "@/types/user";

import type {
  StudyPlanMode,
} from "./types";

import {
  saveStudyPlanToCalendar,
} from "./saveStudyPlanToCalendar";

interface Options {
  uid: string;

  tasks:
    StudyTask[];

  dailyHours: number;

  alan:
    AlanOption | "";

  mode:
    StudyPlanMode;

  selectedDate: string;
}

export async function runStudyPlanCalendarSave(
  options: Options
) {
  await saveStudyPlanToCalendar(
    options
  );

  window.dispatchEvent(
    new Event(
      "study-calendar-updated"
    )
  );
}