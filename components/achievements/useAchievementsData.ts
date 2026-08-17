"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  useStreak,
} from "@/hooks/useStreak";

import {
  getExamResults,
} from "@/services/examService";

import {
  getTopicProgress,
  type SubjectProgressMap,
} from "@/services/topicService";

export function useAchievementsData() {
  const { user } =
    useAuth();

  const {
    streak,
    loading:
      streakLoading,
  } = useStreak();

  const [
    progressMap,
    setProgressMap,
  ] =
    useState<SubjectProgressMap>(
      {}
    );

  const [
    examCount,
    setExamCount,
  ] =
    useState(0);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    if (!user) {
      setProgressMap({});
      setExamCount(0);
      setLoading(false);

      return;
    }

    const uid =
      user.uid;

    let active = true;

    async function load() {
      setLoading(true);

      try {
        const [
          progress,
          exams,
        ] =
          await Promise.all([
            getTopicProgress(
              uid
            ),

            getExamResults(
              uid,
              100
            ),
          ]);

        if (!active) {
          return;
        }

        setProgressMap(
          progress
        );

        setExamCount(
          exams.length
        );
      } catch (error) {
        console.error(
          "Başarı verileri yüklenemedi:",
          error
        );

        if (active) {
          setProgressMap({});
          setExamCount(0);
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
  }, [user]);

  return {
    progressMap,
    examCount,

    longestStreak:
      streak
        ?.longestStreak ??
      0,

    loading:
      loading ||
      streakLoading,
  };
}
