import {
  formatCalendarDate,
} from "@/services/calendar";

import type {
  StudyPlanMode,
} from "./types";

import {
  isAssignmentDateAvailable,
} from "./dateAvailability";

import {
  getMonthGrid,
} from "./studyPlanDatePickerUtils";

const WEEKDAYS = [
  "Pzt",
  "Sal",
  "Çar",
  "Per",
  "Cum",
  "Cmt",
  "Paz",
];

interface Props {
  year: number;
  month: number;

  mode: StudyPlanMode;

  value: string;

  busyDates:
    ReadonlySet<string>;

  disabled?: boolean;

  onChange:
    (date: string) => void;
}

export function StudyPlanDateGrid({
  year,
  month,
  mode,
  value,
  busyDates,
  disabled = false,
  onChange,
}: Props) {
  const days =
    getMonthGrid(
      year,
      month
    );

  return (
    <>
      <div className="mt-3 grid grid-cols-7">
        {WEEKDAYS.map(
          (day) => (
            <div
              key={day}
              className="py-1 text-center text-[9px] font-bold text-slate-400"
            >
              {day}
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(
          (day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-9"
                />
              );
            }

            const date =
              formatCalendarDate(
                day
              );

            const busy =
              busyDates.has(
                date
              );

            const available =
              isAssignmentDateAvailable(
                busyDates,
                date,
                mode
              );

            const selected =
              value === date;

            return (
              <button
                key={date}
                type="button"
                disabled={
                  disabled ||
                  !available
                }
                onClick={() =>
                  onChange(date)
                }
                title={
                  busy
                    ? "Bu tarihte ödev var"
                    : !available
                      ? "Bu haftada dolu bir gün var"
                      : undefined
                }
                className={
                  getDayClassName({
                    busy,
                    available,
                    selected,
                  })
                }
              >
                {day.getDate()}
              </button>
            );
          }
        )}
      </div>
    </>
  );
}

function getDayClassName({
  busy,
  available,
  selected,
}: {
  busy: boolean;
  available: boolean;
  selected: boolean;
}) {
  const base =
    "h-9 rounded-lg text-xs font-semibold transition";

  if (busy) {
    return `${base} cursor-not-allowed bg-rose-100 text-rose-600 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900`;
  }

  if (!available) {
    return `${base} cursor-not-allowed bg-slate-100 text-slate-300 dark:bg-slate-800/60 dark:text-slate-600`;
  }

  if (selected) {
    return `${base} bg-blue-600 text-white`;
  }

  return `${base} text-slate-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-blue-950/40`;
}