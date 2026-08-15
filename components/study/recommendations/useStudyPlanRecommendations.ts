"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ExamResult,
} from "@/types/exam";

import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  UserProfile,
} from "@/types/user";

import {
  getExamResults,
} from "@/services/examService";

import {
  getUserProfile,
} from "@/services/userService";

import {
  createTaskRecommendation,
} from "@/lib/recommendations/recommendationEngine";

export function useStudyPlanRecommendations(
  uid: string | null,
  tasks: StudyTask[]
) {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [exams, setExams] =
    useState<ExamResult[]>([]);

  const [loading, setLoading] =
    useState(Boolean(uid));

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    let active = true;

    async function load() {
      setLoading(true);

      try {
        const [userProfile, results] =
          await Promise.all([
            getUserProfile(uid!),
            getExamResults(uid!, 20),
          ]);

        if (!active) return;

        setProfile(userProfile);
        setExams(results);
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
  }, [uid]);

  const recommendations =
    useMemo(
      () =>
        Object.fromEntries(
          tasks.map((task) => [
            task.id,
            createTaskRecommendation(
              task,
              profile,
              exams
            ),
          ])
        ),
      [tasks, profile, exams]
    );

  return {
    loading,
    recommendations,
  };
}