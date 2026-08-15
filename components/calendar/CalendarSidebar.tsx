"use client";

import type {
  CalendarEvent,
} from "@/services/calendar";

import {
  CalendarDayPanel,
} from "./CalendarDayPanel";

import {
  CalendarMonthSummary,
} from "./CalendarMonthSummary";

import type {
  CreateDayEventInput,
} from "./hooks/useCalendarController";

interface Props {
  uid: string | null;

  selectedDate:
    string | null;

  selectedEvents:
    CalendarEvent[];

  events:
    CalendarEvent[];

  year: number;
  month: number;
  loading: boolean;

  onCloseDay:
    () => void;

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

export function CalendarSidebar({
  uid,
  selectedDate,
  selectedEvents,
  events,
  year,
  month,
  loading,
  onCloseDay,
  onCreate,
  onDelete,
  onClearDay,
}: Props) {
  return (
    <div className="space-y-3">
      {selectedDate && (
        <CalendarDayPanel
          uid={uid}
          date={selectedDate}
          events={
            selectedEvents
          }
          onClose={
            onCloseDay
          }
          onCreate={
            onCreate
          }
          onDelete={
            onDelete
          }
          onClearDay={
            onClearDay
          }
        />
      )}

      <CalendarMonthSummary
        events={events}
        year={year}
        month={month}
      />

      {loading && (
        <p className="text-center text-xs text-slate-400">
          Yükleniyor...
        </p>
      )}
    </div>
  );
}