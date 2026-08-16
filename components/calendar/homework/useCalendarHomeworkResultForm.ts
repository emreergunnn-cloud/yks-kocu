"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  CalendarEvent,
} from "@/services/calendar";

import type {
  StudyTaskResultSummary,
} from "@/types/studyTaskProgress";

import {
  submitCalendarHomeworkResult,
} from "./submitCalendarHomeworkResult";

interface Options {
  uid: string;
  event: CalendarEvent;
}

export function useCalendarHomeworkResultForm({
  uid,
  event,
}: Options) {
  const [solved, setSolved] =
    useState("");

  const [correct, setCorrect] =
    useState("");

  const [wrong, setWrong] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState<
      StudyTaskResultSummary | null
    >(null);

  const values = useMemo(
    () => ({
      solved:
        Number(solved) || 0,

      correct:
        Number(correct) || 0,

      wrong:
        Number(wrong) || 0,
    }),
    [
      solved,
      correct,
      wrong,
    ]
  );

  async function submit() {
    try {
      setSaving(true);
      setError("");

      const savedResult =
        await submitCalendarHomeworkResult({
          uid,
          event,
          values,
        });

      setResult(savedResult);

      window.dispatchEvent(
        new Event(
          "study-progress-updated"
        )
      );

      window.dispatchEvent(
        new Event(
          "study-calendar-updated"
        )
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Ödev sonucu kaydedilemedi."
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    solved,
    setSolved,

    correct,
    setCorrect,

    wrong,
    setWrong,

    saving,
    error,
    result,
    submit,
  };
}