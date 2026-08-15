"use client";

import {
  useState,
} from "react";

import {
  X,
} from "lucide-react";

import type {
  CalendarEvent,
} from "@/services/calendar";

import {
  parseCalendarDate,
} from "@/services/calendar";

import {
  CalendarClearButton,
} from "./CalendarClearButton";

import {
  CalendarEventForm,
} from "./CalendarEventForm";

import {
  CalendarEventList,
} from "./CalendarEventList";

import {
  useCalendarStudyRecommendations,
} from "./hooks/useCalendarStudyRecommendations";

import type {
  CreateDayEventInput,
} from "./hooks/useCalendarController";

interface Props {
  uid: string | null;
  date: string;
  events: CalendarEvent[];

  onClose: () => void;

  onCreate:
    (
      input:
        CreateDayEventInput
    ) => Promise<void>;

  onDelete:
    (
      eventId: string
    ) => Promise<void>;

  onClearDay:
    () => Promise<void>;
}

export function CalendarDayPanel({
  uid,
  date,
  events,
  onClose,
  onCreate,
  onDelete,
  onClearDay,
}: Props) {
  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const {
    recommendations,
  } =
    useCalendarStudyRecommendations(
      uid,
      events
    );

  const dateLabel =
    parseCalendarDate(
      date
    ).toLocaleDateString(
      "tr-TR",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
      }
    );

  async function createEvent(
    input:
      CreateDayEventInput
  ) {
    await onCreate(input);
    setShowForm(false);
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold">
          {dateLabel}
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <CalendarClearButton
          label="Bu Günü Temizle"
          onConfirm={
            onClearDay
          }
        />

        {showForm ? (
          <CalendarEventForm
            onSave={
              createEvent
            }
            onCancel={() =>
              setShowForm(
                false
              )
            }
          />
        ) : (
          <CalendarEventList
            events={events}
            recommendations={
              recommendations
            }
            onAdd={() =>
              setShowForm(
                true
              )
            }
            onDelete={
              onDelete
            }
          />
        )}
      </div>
    </div>
  );
}