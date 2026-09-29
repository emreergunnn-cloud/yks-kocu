"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  generateStudyPlan,
} from "@/lib/study/planGenerator";

import {
  getStudyTaskProgress,
} from "@/services/studyTaskProgressService";

import type {
  SubjectProgressMap,
} from "@/services/topicService";

import type {
  StudyTaskProgressMap,
} from "@/types/studyTaskProgress";

import type {
  AlanOption,
  SinifOption,
} from "@/types/user";

import {
  usePendingStudyTaskIds,
} from "./usePendingStudyTaskIds";

interface Options {
  uid?: string | null;

  progressMap:
    SubjectProgressMap;

  dailyHours: number;

  alan:
    AlanOption | "";

  refreshKey: number;
  sinif: SinifOption | "";
}

export function useAdaptiveStudyPlan({
  uid,
  progressMap,
  dailyHours,
  alan,
  sinif,
  refreshKey,
}: Options) {
  const [
    taskProgress,
    setTaskProgress,
  ] = useState<
    StudyTaskProgressMap
  >({});

  const [
    revision,
    setRevision,
  ] =
    useState(0);

  const {
    pendingTaskIds,
  } =
    usePendingStudyTaskIds(
      uid ?? null
    );

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

    return () => {
      window.removeEventListener(
        "study-progress-updated",
        refresh
      );
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!uid) {
        if (active) {
          setTaskProgress(
            {}
          );
        }

        return;
      }

      const progress =
        await getStudyTaskProgress(
          uid
        );

      if (active) {
        setTaskProgress(
          progress
        );
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [
    uid,
    refreshKey,
    revision,
  ]);

  return useMemo(
    () =>
      !sinif ? [] : generateStudyPlan({
        progressMap,
        dailyHours,
        alan,
        sinif,
        taskProgress,

        excludedTaskIds:
          pendingTaskIds,
      }),
    [
      progressMap,
      dailyHours,
      alan,
      sinif,
      taskProgress,
      pendingTaskIds,
    ]
  );
}