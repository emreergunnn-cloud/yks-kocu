"use client";

import {
  useState,
} from "react";

import {
  formatCalendarDate,
} from "@/services/calendar";

import type {
  StudyPlanMode,
} from "./types";

export function useStudyPlanCalendarState() {
  const [
    mode,
    setMode,
  ] =
    useState<StudyPlanMode>(
      "daily"
    );

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState(
      formatCalendarDate(
        new Date()
      )
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    saved,
    setSaved,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  function resetStatus() {
    setSaved(false);
    setError(null);
  }

  function changeMode(
    value: StudyPlanMode
  ) {
    if (saving) {
      return;
    }

    setMode(value);
    resetStatus();
  }

  function changeDate(
    value: string
  ) {
    setSelectedDate(value);
    resetStatus();
  }

  return {
    mode,
    selectedDate,

    saving,
    saved,
    error,

    setSaving,
    setSaved,
    setError,

    resetStatus,
    changeMode,
    changeDate,
  };
}