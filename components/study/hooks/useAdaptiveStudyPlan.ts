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
  getStudyPlanAssignmentCounts,
} from "@/services/studyPlanService";

import type {
  SubjectProgressMap,
} from "@/services/topicService";

import type {
  AlanOption,
} from "@/types/user";

import type {
  StudyAssignmentCounts,
} from "@/types/studyPlan";

interface Options {
  uid?: string | null;

  progressMap:
    SubjectProgressMap;

  dailyHours: number;

  alan:
    AlanOption | "";

  refreshKey: number;
}

export function useAdaptiveStudyPlan({
  uid,
  progressMap,
  dailyHours,
  alan,
  refreshKey,
}: Options) {
  const [
    assignmentCounts,
    setAssignmentCounts,
  ] = useState<
    StudyAssignmentCounts
  >({});

  useEffect(() => {
    let active = true;

    async function load() {
      if (!uid) {
        if (active) {
          setAssignmentCounts(
            {}
          );
        }

        return;
      }

      const counts =
        await getStudyPlanAssignmentCounts(
          uid
        );

      if (active) {
        setAssignmentCounts(
          counts
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
  ]);

  return useMemo(
    () =>
      generateStudyPlan({
        progressMap,
        dailyHours,
        alan,
        assignmentCounts,
      }),

    [
      progressMap,
      dailyHours,
      alan,
      assignmentCounts,
    ]
  );
}