"use client";

import type {
  StudyPlanMode,
} from "./types";

import {
  isAssignmentDateAvailable,
} from "./dateAvailability";

import {
  StudyPlanDatePickerHeader,
} from "./StudyPlanDatePickerHeader";

import {
  StudyPlanDateGrid,
} from "./StudyPlanDateGrid";

import {
  StudyPlanDatePickerMessage,
} from "./StudyPlanDatePickerMessage";

import {
  useStudyPlanDatePickerView,
} from "./useStudyPlanDatePickerView";

interface Props {
  mode: StudyPlanMode;

  value: string;

  busyDates:
    ReadonlySet<string>;

  disabled?: boolean;

  loading?: boolean;

  onChange:
    (value: string) => void;
}

export function StudyPlanCalendarDatePicker({
  mode,
  value,
  busyDates,
  disabled = false,
  loading = false,
  onChange,
}: Props) {
  const {
    viewDate,
    moveMonth,
  } =
    useStudyPlanDatePickerView(
      value
    );

  const unavailable =
    Boolean(
      value &&
        !isAssignmentDateAvailable(
          busyDates,
          value,
          mode
        )
    );

  const controlsDisabled =
    disabled || loading;

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
      <p className="mb-2 text-[11px] font-medium text-slate-500">
        {mode === "daily"
          ? "Ödev tarihi"
          : "Hafta başlangıç tarihi"}
      </p>

      <StudyPlanDatePickerHeader
        year={
          viewDate.getFullYear()
        }
        month={
          viewDate.getMonth()
        }
        disabled={
          controlsDisabled
        }
        onPrevious={() =>
          moveMonth(-1)
        }
        onNext={() =>
          moveMonth(1)
        }
      />

      <StudyPlanDateGrid
        year={
          viewDate.getFullYear()
        }
        month={
          viewDate.getMonth()
        }
        mode={mode}
        value={value}
        busyDates={
          busyDates
        }
        disabled={
          controlsDisabled
        }
        onChange={onChange}
      />

      <StudyPlanDatePickerMessage
        mode={mode}
        loading={loading}
        unavailable={
          unavailable
        }
      />
    </div>
  );
}