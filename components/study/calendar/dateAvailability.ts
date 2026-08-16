import {
  formatCalendarDate,
  parseCalendarDate,
} from "@/services/calendar";

import type {
  StudyPlanMode,
} from "./types";

export function getAssignmentDates(
  startDate: string,
  mode: StudyPlanMode
): string[] {
  if (!startDate) {
    return [];
  }

  const start =
    parseCalendarDate(
      startDate
    );

  const dayCount =
    mode === "weekly"
      ? 7
      : 1;

  return Array.from(
    {
      length: dayCount,
    },
    (_, index) => {
      const date =
        new Date(start);

      date.setDate(
        start.getDate() +
          index
      );

      return formatCalendarDate(
        date
      );
    }
  );
}

export function isAssignmentDateAvailable(
  busyDates:
    ReadonlySet<string>,

  startDate: string,

  mode: StudyPlanMode
): boolean {
  return getAssignmentDates(
    startDate,
    mode
  ).every(
    (date) =>
      !busyDates.has(date)
  );
}