"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getCalendarEvents,
} from "@/services/calendar/eventService";

export function usePendingStudyTaskIds(
  uid: string | null
) {
  const [
    pendingTaskIds,
    setPendingTaskIds,
  ] =
    useState<
      Set<string>
    >(new Set());

  const [
    loading,
    setLoading,
  ] =
    useState(
      Boolean(uid)
    );

  const [
    revision,
    setRevision,
  ] =
    useState(0);

  useEffect(() => {
    function refresh() {
      setRevision(
        (value) =>
          value + 1
      );
    }

    window.addEventListener(
      "study-calendar-updated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "study-calendar-updated",
        refresh
      );
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!uid) {
        setPendingTaskIds(
          new Set()
        );

        setLoading(false);

        return;
      }

      setLoading(true);

      try {
        const events =
          await getCalendarEvents(
            uid
          );

        const ids =
          new Set<string>();

        for (
          const event
          of events
        ) {
          if (
            event.source !==
              "studyPlan" ||
            !event.studyTaskId
          ) {
            continue;
          }

          if (
            event.homeworkStatus ===
            "completed"
          ) {
            continue;
          }

          ids.add(
            event.studyTaskId
          );
        }

        if (active) {
          setPendingTaskIds(
            ids
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [
    uid,
    revision,
  ]);

  return {
    pendingTaskIds,
    loading,
  };
}