"use client";

import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  AlanOption,
} from "@/types/user";

import {
  isAssignmentDateAvailable,
} from "./dateAvailability";

import {
  runStudyPlanCalendarSave,
} from "./runStudyPlanCalendarSave";

import {
  useStudyPlanBusyDates,
} from "./useStudyPlanBusyDates";

import {
  useStudyPlanCalendarState,
} from "./useStudyPlanCalendarState";

interface Options {
  uid: string;

  tasks:
    StudyTask[];

  dailyHours: number;

  alan:
    AlanOption | "";
}

export function useStudyPlanCalendarActions(
  options: Options
) {
  const state =
    useStudyPlanCalendarState();

  const availability =
    useStudyPlanBusyDates(
      options.uid
    );

  const dateAvailable =
    isAssignmentDateAvailable(
      availability.busyDates,
      state.selectedDate,
      state.mode
    );

  async function save() {
    if (
      state.saving ||
      !options.tasks.length
    ) {
      return;
    }

    if (
      !state.selectedDate ||
      !dateAvailable
    ) {
      state.setError(
        "Seçilen tarihte mevcut ödev bulunuyor."
      );

      return;
    }

    try {
      state.setSaving(true);
      state.resetStatus();

      await runStudyPlanCalendarSave({
        ...options,

        mode:
          state.mode,

        selectedDate:
          state.selectedDate,
      });

      state.setSaved(true);
    } catch (saveError) {
      console.error(
        saveError
      );

      state.setError(
        "Plan takvime eklenirken bir hata oluştu."
      );
    } finally {
      state.setSaving(false);
    }
  }

  return {
    mode:
      state.mode,

    selectedDate:
      state.selectedDate,

    busyDates:
      availability.busyDates,

    availabilityLoading:
      availability.loading,

    dateAvailable,

    saving:
      state.saving,

    saved:
      state.saved,

    error:
      state.error,

    totalDailyMinutes:
      Math.round(
        options.dailyHours *
          60
      ),

    changeMode:
      state.changeMode,

    changeDate:
      state.changeDate,

    save,
  };
}