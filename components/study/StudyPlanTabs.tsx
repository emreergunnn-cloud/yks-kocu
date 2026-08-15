"use client";

import { BarChart2, Calendar } from "lucide-react";

export type StudyPlanTab = "today" | "subjects";

interface StudyPlanTabsProps {
  activeTab: StudyPlanTab;
  onChange: (tab: StudyPlanTab) => void;
}

export function StudyPlanTabs({
  activeTab,
  onChange,
}: StudyPlanTabsProps) {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
      <button
        type="button"
        onClick={() => onChange("today")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
          activeTab === "today"
            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
      >
        <Calendar className="w-4 h-4" />
        Bugünkü Plan
      </button>

      <button
        type="button"
        onClick={() => onChange("subjects")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
          activeTab === "subjects"
            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
      >
        <BarChart2 className="w-4 h-4" />
        Ders Durumu
      </button>
    </div>
  );
}