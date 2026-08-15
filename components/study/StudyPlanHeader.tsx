"use client";

import { Brain, RefreshCw } from "lucide-react";

interface StudyPlanHeaderProps {
  today: string;
  onRefresh: () => void;
}

export function StudyPlanHeader({
  today,
  onRefresh,
}: StudyPlanHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          Çalışma Planı
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Sana özel, konu sırasına ve eksiklerine göre oluşturulan
          çalışma programı.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {today}
        </span>

        <button
          type="button"
          onClick={onRefresh}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Planı yenile"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
}