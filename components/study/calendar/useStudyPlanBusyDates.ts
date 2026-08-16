"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getStudyPlanBusyDates,
} from "@/services/calendar/eventService";

export function useStudyPlanBusyDates(
  uid: string
) {
  const [
    busyDates,
    setBusyDates,
  ] =
    useState<
      Set<string>
    >(new Set());

  const [
    loading,
    setLoading,
  ] =
    useState(true);

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
      setLoading(true);

      try {
        const dates =
          await getStudyPlanBusyDates(
            uid
          );

        if (active) {
          setBusyDates(
            dates
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
    busyDates,
    loading,
  };
}