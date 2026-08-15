"use client";

import {
  BookOpen,
  ClipboardList,
  Target,
  X,
} from "lucide-react";

import type {
  CalendarEvent,
} from "@/services/calendar";

import type {
  TaskRecommendation,
} from "@/types/recommendation";

import {
  StudyTaskResources,
} from "@/components/study/recommendations/StudyTaskResources";

import {
  TYPE_CONFIG,
} from "./calendarConfig";

interface Props {
  event: CalendarEvent;

  recommendation?:
    TaskRecommendation;

  onDelete:
    (
      eventId: string
    ) => Promise<void>;
}

export function CalendarEventRow({
  event,
  recommendation,
  onDelete,
}: Props) {
  const config =
    TYPE_CONFIG[event.type];

  const Icon =
    event.type === "exam"
      ? ClipboardList
      : event.type === "goal"
        ? Target
        : BookOpen;

  const canDelete =
    !event.id.startsWith(
      "exam-"
    );

  return (
    <div>
      <div
        className={`p-3 rounded-xl border ${config.border} ${config.bg}`}
      >
        <div className="flex items-start gap-2">
          <Icon
            className={`w-4 h-4 mt-0.5 shrink-0 ${config.textColor}`}
          />

          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${config.textColor}`}
            >
              {event.title}
            </p>

            {event.durationMinutes ? (
              <p className="text-[11px] text-slate-400 mt-0.5">
                {
                  event.durationMinutes
                }{" "}
                dakika
              </p>
            ) : null}

            {event.notes ? (
              <p className="text-[11px] text-slate-400 mt-0.5">
                {event.notes}
              </p>
            ) : null}
          </div>

          {canDelete && (
            <button
              type="button"
              onClick={() =>
                void onDelete(
                  event.id
                )
              }
              className="text-slate-400 hover:text-rose-500"
              title="Etkinliği sil"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {recommendation && (
        <StudyTaskResources
          recommendation={
            recommendation
          }
        />
      )}
    </div>
  );
}