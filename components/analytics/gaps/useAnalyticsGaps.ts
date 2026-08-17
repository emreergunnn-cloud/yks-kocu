"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getStudyTaskProgress,
} from "@/services/studyTaskProgressService";

import {
  buildAnalyticsGaps,
} from "@/lib/analytics/gaps/buildAnalyticsGaps";

import type {
  AnalyticsGaps,
} from "@/types/analyticsGap";

const EMPTY: AnalyticsGaps = {
  homework: [],
  topics: [],
  totalRemainingQuestions: 0,
};

export function useAnalyticsGaps(
  uid: string | null
) {
  const [
    gaps,
    setGaps,
  ] =
    useState<AnalyticsGaps>(
      EMPTY
    );

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
      "study-progress-updated",
      refresh
    );

    return () =>
      window.removeEventListener(
        "study-progress-updated",
        refresh
      );
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!uid) {
        setGaps(EMPTY);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const progress =
          await getStudyTaskProgress(
            uid
          );

        if (active) {
          setGaps(
            buildAnalyticsGaps(
              progress
            )
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
    gaps,
    loading,
  };
}