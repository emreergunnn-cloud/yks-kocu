"use client";

import { useState } from "react";
import type { MasteryResult } from "../../services/masteryEngine";
import { buildGoals } from "./goal-tracker/buildGoals";
import { GoalItems } from "./goal-tracker/GoalItems";
import { GoalTabs } from "./goal-tracker/GoalTabs";
import type { TabType } from "./goal-tracker/types";
import { useGoalTrackerData } from "./goal-tracker/useGoalTrackerData";
import { WeakTopics } from "./goal-tracker/WeakTopics";

export function GoalTracker({ masteries }: { masteries?: Record<string, MasteryResult> }) {
  const [activeTab, setActiveTab] = useState<TabType>("daily");
  const data = useGoalTrackerData();
  if (data.loading) return <div className="space-y-3">{[1, 2].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />)}</div>;
  const goals = buildGoals(data.settings, data.studyStats, data.examCount, data.completedTopics);
  return <div className="space-y-4"><GoalTabs active={activeTab} onChange={setActiveTab} /><GoalItems goals={goals[activeTab]} /><WeakTopics masteries={masteries} /></div>;
}
