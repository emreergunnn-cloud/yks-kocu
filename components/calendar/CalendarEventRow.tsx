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
  MebRemediationDetails,
} from "@/components/study/remediation/MebRemediationDetails";

import {
  CalendarHomeworkResultEntry,
} from "./homework/CalendarHomeworkResultEntry";

import {
  TYPE_CONFIG,
} from "./calendarConfig";

interface Props {
  uid: string | null;

  event:
    CalendarEvent;

  recommendation?:
    TaskRecommendation;

  onDelete:
    (
      eventId: string
    ) => Promise<void>;
}

export function CalendarEventRow({
  uid,
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
        className={`rounded-xl border p-3 ${config.border} ${config.bg}`}
      >
        <div className="flex items-start gap-2">
          <Icon
            className={`mt-0.5 h-4 w-4 shrink-0 ${config.textColor}`}
          />

          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-medium ${config.textColor}`}
            >
              {event.title}
            </p>

            {event.durationMinutes ? (
              <p className="mt-0.5 text-[11px] text-slate-400">
                {event.durationMinutes}
                {" dakika"}
              </p>
            ) : null}

            {event.notes ? (
              <p className="mt-0.5 text-[11px] text-slate-400">
                {event.notes}
              </p>
            ) : null}

            {!!event
              .carryoverQuestions && (
              <p className="mt-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                Önceki ödevden
                {" +"}
                {
                  event
                    .carryoverQuestions
                }
                {" soru dahil"}
              </p>
            )}

            {uid && (
              <CalendarHomeworkResultEntry
                uid={uid}
                event={event}
              />
            )}
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
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {event.remediation &&
        event.subjectId &&
        event.topicId && (
          <MebRemediationDetails
            subjectId={
              event.subjectId
            }
            topicId={
              event.topicId
            }
            remediation={
              event.remediation
            }
          />
        )}

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