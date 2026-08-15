"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";

import {
  computeSubjectStats,
  getTopicProgress,
  type SubjectProgressMap,
} from "@/services/topicService";

import {
  getUserProfile,
} from "@/services/userService";

import {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

import type {
  AlanOption,
} from "@/types/user";

export function useStudyPlannerData(
  refreshKey: number
) {
  const { user } = useAuth();

  const [progressMap, setProgressMap] =
    useState<SubjectProgressMap>({});

  const [alan, setAlan] =
    useState<AlanOption | "">("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const uid = user.uid;
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const [progress, profile] =
          await Promise.all([
            getTopicProgress(uid),
            getUserProfile(uid),
          ]);

        if (!active) return;

        setProgressMap(progress);
        setAlan(profile?.alan ?? "");
      } catch (error) {
        console.error(
          "Çalışma planı verileri alınamadı:",
          error
        );

        if (active) {
          setProgressMap({});
          setAlan("");
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
  }, [user, refreshKey]);

  const subjectStats = useMemo(
    () =>
      YKS_SUBJECTS.map((subject) => ({
        ...subject,
        stats: computeSubjectStats(
          subject.id,
          subject.topics.map((topic) => topic.id),
          progressMap
        ),
      })),
    [progressMap]
  );

  const overallCompleted =
    subjectStats.reduce(
      (total, subject) =>
        total + subject.stats.completed,
      0
    );

  const overallTotal =
    subjectStats.reduce(
      (total, subject) =>
        total + subject.stats.total,
      0
    );

  const overallPercent =
    overallTotal > 0
      ? Math.round(
          (overallCompleted / overallTotal) * 100
        )
      : 0;

  return {
    progressMap,
    alan,
    subjectStats,
    overallCompleted,
    overallTotal,
    overallPercent,
    loading,
    uid: user?.uid ?? null,
  };
}