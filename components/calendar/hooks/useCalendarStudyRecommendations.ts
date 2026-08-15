"use client";

import {
  useMemo,
} from "react";

import type {
  CalendarEvent,
} from "@/services/calendar";

import type {
  TaskRecommendation,
} from "@/types/recommendation";

import {
  useStudyPlanRecommendations,
} from "@/components/study/recommendations/useStudyPlanRecommendations";

import {
  calendarEventToStudyTask,
} from "../utils/calendarEventToStudyTask";

export function useCalendarStudyRecommendations(
  uid: string | null,
  events: CalendarEvent[]
) {
  const mapped =
    useMemo(
      () =>
        events.flatMap(
          (event) => {
            const task =
              calendarEventToStudyTask(
                event
              );

            if (!task) {
              return [];
            }

            return [
              {
                eventId:
                  event.id,
                task,
              },
            ];
          }
        ),
      [events]
    );

  const tasks =
    useMemo(
      () =>
        mapped.map(
          (item) =>
            item.task
        ),
      [mapped]
    );

  const {
    recommendations,
    loading,
  } =
    useStudyPlanRecommendations(
      uid,
      tasks
    );

  const byEventId =
    useMemo(() => {
      const result:
        Record<
          string,
          TaskRecommendation
        > = {};

      for (
        const item of mapped
      ) {
        const recommendation =
          recommendations[
            item.task.id
          ];

        if (recommendation) {
          result[
            item.eventId
          ] = recommendation;
        }
      }

      return result;
    }, [
      mapped,
      recommendations,
    ]);

  return {
    loading,
    recommendations:
      byEventId,
  };
}