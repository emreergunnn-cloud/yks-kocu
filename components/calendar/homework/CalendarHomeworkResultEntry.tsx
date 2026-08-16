"use client";

import {
  useState,
} from "react";

import {
  ClipboardCheck,
} from "lucide-react";

import type {
  CalendarEvent,
} from "@/services/calendar";

import {
  CalendarHomeworkResultForm,
} from "./CalendarHomeworkResultForm";

import {
  CalendarHomeworkResultSummary,
} from "./CalendarHomeworkResultSummary";

import {
  getCalendarEventResult,
} from "./calendarEventResult";

import {
  useCalendarHomeworkResultForm,
} from "./useCalendarHomeworkResultForm";

interface Props {
  uid: string;
  event: CalendarEvent;
}

export function CalendarHomeworkResultEntry({
  uid,
  event,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const form =
    useCalendarHomeworkResultForm({
      uid,
      event,
    });

  if (!isStudyHomework(event)) {
    return null;
  }

  if (form.result) {
    return (
      <CalendarHomeworkResultSummary
        result={form.result}
      />
    );
  }

  if (
    event.homeworkStatus ===
    "completed"
  ) {
    return (
      <CalendarHomeworkResultSummary
        result={
          getCalendarEventResult(
            event
          )
        }
      />
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400"
      >
        <ClipboardCheck className="h-4 w-4" />
        Ödev Sonucunu Gir
      </button>
    );
  }

  return (
    <CalendarHomeworkResultForm
      questionCount={
        event.questionCount
      }
      solved={form.solved}
      correct={form.correct}
      wrong={form.wrong}
      saving={form.saving}
      error={form.error}
      setSolved={form.setSolved}
      setCorrect={form.setCorrect}
      setWrong={form.setWrong}
      onSubmit={() =>
        void form.submit()
      }
      onCancel={() =>
        setOpen(false)
      }
    />
  );
}

function isStudyHomework(
  event: CalendarEvent
): event is CalendarEvent & {
  studyTaskId: string;
  questionCount: number;
} {
  return (
    event.source === "studyPlan" &&
    Boolean(event.studyTaskId) &&
    Boolean(event.questionCount)
  );
}