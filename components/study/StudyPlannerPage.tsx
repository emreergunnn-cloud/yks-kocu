"use client";

import {
  useState,
} from "react";

import {
  getStudyPlanSummary,
} from "@/lib/study/planSummary";

import {
  StudyPlannerHeader,
} from "./StudyPlannerHeader";

import {
  StudyPlannerLoading,
} from "./StudyPlannerLoading";

import {
  StudyPlannerTabs,
  type StudyPlannerTab,
} from "./StudyPlannerTabs";

import {
  StudyPlannerToday,
} from "./StudyPlannerToday";

import {
  StudyPlannerSubjects,
} from "./StudyPlannerSubjects";

import {
  useStudyPlannerData,
} from "./useStudyPlannerData";

import {
  useAdaptiveStudyPlan,
} from "./hooks/useAdaptiveStudyPlan";

export function StudyPlannerPage() {
  const [
    dailyHours,
    setDailyHours,
  ] = useState(4);

  const [
    tab,
    setTab,
  ] = useState<StudyPlannerTab>(
    "today"
  );

  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  const data =
    useStudyPlannerData(
      refreshKey
    );

  const studyPlan =
    useAdaptiveStudyPlan({
      uid: data.uid,
      progressMap:
        data.progressMap,
      dailyHours,
      alan: data.alan,
      refreshKey,
    });

  const {
    totalMinutes,
    totalQuestions,
  } = getStudyPlanSummary(
    studyPlan
  );

  if (data.loading) {
    return (
      <StudyPlannerLoading />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <StudyPlannerHeader
        onRefresh={() =>
          setRefreshKey(
            (value) =>
              value + 1
          )
        }
      />

      <StudyPlannerTabs
        activeTab={tab}
        onChange={setTab}
      />

      {tab === "today" ? (
        <StudyPlannerToday
          dailyHours={
            dailyHours
          }
          setDailyHours={
            setDailyHours
          }
          studyPlan={
            studyPlan
          }
          totalMinutes={
            totalMinutes
          }
          totalQuestions={
            totalQuestions
          }
          uid={data.uid}
          alan={data.alan}
        />
      ) : (
        <StudyPlannerSubjects
          subjectStats={
            data.subjectStats
          }
          overallCompleted={
            data.overallCompleted
          }
          overallTotal={
            data.overallTotal
          }
          overallPercent={
            data.overallPercent
          }
        />
      )}
    </div>
  );
}