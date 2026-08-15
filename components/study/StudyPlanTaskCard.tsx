"use client";

import React from "react";
import {
  BookOpen,
  Brain,
  Clock,
  RotateCcw,
  Target,
} from "lucide-react";

import type { StudyTask } from "@/types/studyPlan";

interface StudyPlanTaskCardProps {
  task: StudyTask;
  index: number;
}

export const StudyPlanTaskCard: React.FC<
  StudyPlanTaskCardProps
> = ({ task, index }) => {
  const typeConfig = {
    revision: {
      label: "Tekrar",
      icon: RotateCcw,
      badge:
        "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
      number:
        "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
    },
    weak: {
      label: "Çalışılıyor",
      icon: Target,
      badge:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      number:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    },
    new: {
      label: "Yeni Konu",
      icon: BookOpen,
      badge:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
      number:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    },
  } as const;

  const config = typeConfig[task.type];
  const Icon = config.icon;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-black ${config.number}`}
        >
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {task.subject}
            </span>

            <span className="text-[10px] font-medium text-slate-400">
              {task.category}
            </span>

            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.badge}`}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 truncate">
            {task.topic}
          </p>

          <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.durationMinutes} dk
            </span>

            <span className="inline-flex items-center gap-1">
              <Brain className="w-3 h-3" />
              {task.questionCount} soru
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};