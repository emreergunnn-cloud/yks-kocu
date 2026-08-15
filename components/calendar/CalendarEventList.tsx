"use client";

import {
  CalendarDays,
  Plus,
} from "lucide-react";

import type {
  CalendarEvent,
} from "@/services/calendar";

import type {
  TaskRecommendation,
} from "@/types/recommendation";

import {
  CalendarEventRow,
} from "./CalendarEventRow";

interface Props {
  events: CalendarEvent[];

  recommendations:
    Record<
      string,
      TaskRecommendation
    >;

  onAdd:
    () => void;

  onDelete:
    (
      eventId: string
    ) => Promise<void>;
}

export function CalendarEventList({
  events,
  recommendations,
  onAdd,
  onDelete,
}: Props) {
  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <EmptyState />
      ) : (
        events.map(
          (event) => (
            <CalendarEventRow
              key={event.id}
              event={event}
              recommendation={
                recommendations[
                  event.id
                ]
              }
              onDelete={
                onDelete
              }
            />
          )
        )
      )}

      <button
        type="button"
        onClick={onAdd}
        className="w-full py-2 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-1 text-xs text-slate-500 hover:border-blue-400 hover:text-blue-500"
      >
        <Plus className="w-3.5 h-3.5" />
        Etkinlik Ekle
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-6">
      <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />

      <p className="text-sm text-slate-400">
        Bu gün için etkinlik yok
      </p>
    </div>
  );
}