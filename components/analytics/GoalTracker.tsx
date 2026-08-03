"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserSettings, UserSettings, DEFAULT_SETTINGS } from "../../services/settingsService";
import { getStudyStats, StudyStats } from "../../services/studyStatsService";
import { getExamResults } from "../../services/examService";
import { getTopicProgress } from "../../services/topicService";
import { YKS_SUBJECTS } from "../../lib/constants/subjects";
import { CheckCircle2, Clock, Target, BookOpen, ClipboardList, ChevronUp } from "lucide-react";

type TabType = "daily" | "weekly" | "monthly";

interface GoalItemData {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

export const GoalTracker: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("daily");
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [studyStats, setStudyStats] = useState<StudyStats>({
    todayMinutes: 0, weekMinutes: 0, monthMinutes: 0,
    todaySessions: 0, weekSessions: 0, monthSessions: 0,
  });
  const [examCount, setExamCount] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getUserSettings(user.uid),
      getStudyStats(user.uid),
      getExamResults(user.uid),
      getTopicProgress(user.uid),
    ]).then(([s, stats, exams, pm]) => {
      setSettings(s);
      setStudyStats(stats);
      setExamCount(exams.length);
      const completed = YKS_SUBJECTS.reduce(
        (acc, sub) => acc + sub.topics.filter((t) => pm[sub.id]?.[t.id] === "Tamamlandı").length,
        0
      );
      setCompletedTopics(completed);
      setLoading(false);
    });
  }, [user]);

  const goals: Record<TabType, GoalItemData[]> = {
    daily: [
      {
        id: "daily_hours",
        title: "Çalışma Süresi",
        current: Math.round(studyStats.todayMinutes / 60 * 10) / 10,
        target: settings.dailyGoalHours,
        unit: "sa",
        icon: <Clock className="w-4 h-4" />,
        color: "blue",
      },
      {
        id: "daily_sessions",
        title: "Pomodoro Seansı",
        current: studyStats.todaySessions,
        target: Math.ceil(settings.dailyGoalHours * 2), // ~2 sessions per hour
        unit: "seans",
        icon: <Target className="w-4 h-4" />,
        color: "violet",
      },
    ],
    weekly: [
      {
        id: "weekly_hours",
        title: "Haftalık Çalışma",
        current: Math.round(studyStats.weekMinutes / 60 * 10) / 10,
        target: settings.dailyGoalHours * 7,
        unit: "sa",
        icon: <Clock className="w-4 h-4" />,
        color: "blue",
      },
      {
        id: "weekly_exams",
        title: "Haftalık Deneme",
        current: Math.min(examCount, settings.weeklyGoalExams),
        target: settings.weeklyGoalExams,
        unit: "deneme",
        icon: <ClipboardList className="w-4 h-4" />,
        color: "emerald",
      },
    ],
    monthly: [
      {
        id: "monthly_hours",
        title: "Aylık Çalışma",
        current: Math.round(studyStats.monthMinutes / 60),
        target: settings.dailyGoalHours * 30,
        unit: "sa",
        icon: <Clock className="w-4 h-4" />,
        color: "blue",
      },
      {
        id: "monthly_topics",
        title: "Konu Tamamlama",
        current: completedTopics,
        target: Math.max(50, completedTopics),
        unit: "konu",
        icon: <BookOpen className="w-4 h-4" />,
        color: "amber",
      },
    ],
  };

  const COLOR_MAP: Record<string, { bar: string; icon: string; text: string }> = {
    blue: { bar: "bg-blue-500", icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400", text: "text-blue-600 dark:text-blue-400" },
    violet: { bar: "bg-violet-500", icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400", text: "text-violet-600 dark:text-violet-400" },
    emerald: { bar: "bg-emerald-500", icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400", text: "text-emerald-600 dark:text-emerald-400" },
    amber: { bar: "bg-amber-500", icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400", text: "text-amber-600 dark:text-amber-400" },
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const currentGoals = goals[activeTab];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1.5">
        {(["daily", "weekly", "monthly"] as TabType[]).map((tab) => {
          const labels: Record<TabType, string> = { daily: "Günlük", weekly: "Haftalık", monthly: "Aylık" };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Goal items */}
      <div className="space-y-3">
        {currentGoals.map((goal) => {
          const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
          const colors = COLOR_MAP[goal.color];
          const done = pct >= 100;

          return (
            <div
              key={goal.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 rounded-xl space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colors.icon}`}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : goal.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{goal.title}</span>
                </div>
                <span className={`text-xs font-bold font-mono ${done ? "text-emerald-600 dark:text-emerald-400" : colors.text}`}>
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-500" : colors.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 w-8 text-right">
                  %{pct}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
