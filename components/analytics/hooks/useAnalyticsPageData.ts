"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { isYksGrade } from "@/lib/constants/curriculum/config";
import { computeAnalyticsSummary } from "@/services/analyticsService";
import { getExamResults } from "@/services/examService";
import type { ExamResult } from "@/types/exam";

export function useAnalyticsPageData() {
  const { user, userProfile } = useAuth();
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !userProfile || !isYksGrade(userProfile.sinif)) {
      setExams([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    getExamResults(user.uid)
      .then((results) => active && setExams(results))
      .catch((error) => console.error("Analytics yüklenemedi:", error))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [user?.uid, userProfile?.sinif]);

  const summary = useMemo(
    () => computeAnalyticsSummary(exams, userProfile),
    [exams, userProfile]
  );

  return { uid: user?.uid ?? null, userProfile, exams, summary, loading };
}
