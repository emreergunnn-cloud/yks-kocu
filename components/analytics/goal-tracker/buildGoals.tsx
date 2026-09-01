import { BookOpen, ClipboardList, Clock, Target } from "lucide-react";
import type { UserSettings } from "../../../services/settingsService";
import type { StudyStats } from "../../../services/studyStatsService";
import type { GoalItemData, TabType } from "./types";

export function buildGoals(settings: UserSettings, stats: StudyStats, examCount: number, completedTopics: number): Record<TabType, GoalItemData[]> {
  return {
    daily: [
      { id: "daily_hours", title: "Çalışma Süresi", current: Math.round(stats.todayMinutes / 60 * 10) / 10, target: settings.dailyGoalHours, unit: "sa", icon: <Clock className="h-4 w-4" />, color: "blue" },
      { id: "daily_sessions", title: "Pomodoro Seansı", current: stats.todaySessions, target: Math.ceil(settings.dailyGoalHours * 2), unit: "seans", icon: <Target className="h-4 w-4" />, color: "violet" },
    ],
    weekly: [
      { id: "weekly_hours", title: "Haftalık Çalışma", current: Math.round(stats.weekMinutes / 60 * 10) / 10, target: settings.dailyGoalHours * 7, unit: "sa", icon: <Clock className="h-4 w-4" />, color: "blue" },
      { id: "weekly_exams", title: "Haftalık Deneme", current: Math.min(examCount, settings.weeklyGoalExams), target: settings.weeklyGoalExams, unit: "deneme", icon: <ClipboardList className="h-4 w-4" />, color: "emerald" },
    ],
    monthly: [
      { id: "monthly_hours", title: "Aylık Çalışma", current: Math.round(stats.monthMinutes / 60), target: settings.dailyGoalHours * 30, unit: "sa", icon: <Clock className="h-4 w-4" />, color: "blue" },
      { id: "monthly_topics", title: "Konu Tamamlama", current: completedTopics, target: Math.max(50, completedTopics), unit: "konu", icon: <BookOpen className="h-4 w-4" />, color: "amber" },
    ],
  };
}
