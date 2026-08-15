"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  BarChart2,
  Brain,
  Calendar,
  RefreshCw,
} from "lucide-react";

import {
  generateStudyPlan,
} from "./StudyPlanGenerator";

import {
  StudyPlannerToday,
} from "./StudyPlannerToday";

import {
  StudyPlannerSubjects,
} from "./StudyPlannerSubjects";

import {
  useStudyPlannerData,
} from "./useStudyPlannerData";

export function StudyPlannerPage() {
  const [dailyHours, setDailyHours] = useState(4);
  const [tab, setTab] = useState<"today" | "subjects">("today");
  const [refreshKey, setRefreshKey] = useState(0);

  const data = useStudyPlannerData(refreshKey);

  const studyPlan = useMemo(
    () =>
      generateStudyPlan({
        progressMap: data.progressMap,
        dailyHours,
        alan: data.alan,
      }),
    [data.progressMap, data.alan, dailyHours]
  );

  const totalMinutes = studyPlan.reduce(
    (sum, task) => sum + task.durationMinutes,
    0
  );

  const totalQuestions = studyPlan.reduce(
    (sum, task) => sum + task.questionCount,
    0
  );

  if (data.loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Brain className="w-5 h-5 text-blue-600" />
            Çalışma Planı
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Konu sırana ve eksiklerine göre oluşturulan çalışma programı.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          className="p-2 border rounded-xl"
          title="Planı yenile"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <Tab
          active={tab === "today"}
          onClick={() => setTab("today")}
          icon={<Calendar className="w-4 h-4" />}
          label="Bugünkü Plan"
        />

        <Tab
          active={tab === "subjects"}
          onClick={() => setTab("subjects")}
          icon={<BarChart2 className="w-4 h-4" />}
          label="Ders Durumu"
        />
      </div>

      {tab === "today" ? (
        <StudyPlannerToday
          dailyHours={dailyHours}
          setDailyHours={setDailyHours}
          studyPlan={studyPlan}
          totalMinutes={totalMinutes}
          totalQuestions={totalQuestions}
          uid={data.uid}
          alan={data.alan}
        />
      ) : (
        <StudyPlannerSubjects
          subjectStats={data.subjectStats}
          overallCompleted={data.overallCompleted}
          overallTotal={data.overallTotal}
          overallPercent={data.overallPercent}
        />
      )}
    </div>
  );
}

function Tab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold ${
        active
          ? "bg-white dark:bg-slate-700 shadow-sm"
          : "text-slate-500"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function LoadingState() {
  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
        />
      ))}
    </div>
  );
}