"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  getExamResults,
} from "@/services/examService";

import {
  computeAnalyticsSummary,
} from "@/services/analyticsService";

import type {
  ExamResult,
} from "@/types/exam";

export function useAnalyticsPageData() {
  const {
    user,
    userProfile,
  } = useAuth();

  const [
    exams,
    setExams,
  ] =
    useState<ExamResult[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setExams([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    getExamResults(user.uid)
      .then(setExams)
      .catch((error) =>
        console.error(
          "Analytics yüklenemedi:",
          error
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, [user?.uid]);

  const summary =
    useMemo(
      () =>
        computeAnalyticsSummary(
          exams,
          userProfile
        ),
      [
        exams,
        userProfile,
      ]
    );

  return {
    uid:
      user?.uid ?? null,

    userProfile,
    summary,
    loading,
  };
}