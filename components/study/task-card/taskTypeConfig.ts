import {
  BookOpen,
  RotateCcw,
  Target,
  type LucideIcon,
} from "lucide-react";

import type {
  StudyTaskType,
} from "@/types/studyPlan";

interface Config {
  label: string;
  icon: LucideIcon;
  badge: string;
  number: string;
}

export const TASK_TYPE_CONFIG:
  Record<
    StudyTaskType,
    Config
  > = {
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
};