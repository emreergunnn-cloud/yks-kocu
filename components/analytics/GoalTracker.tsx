"use client";

import React, { useState } from "react";

export interface GoalItem {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  unit: string;
  type: "daily" | "weekly" | "monthly";
}

export const GoalTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");

  const [goals, setGoals] = useState<GoalItem[]>([
    { id: "g1", title: "Soru Çözümü", targetCount: 150, currentCount: 90, unit: "Soru", type: "daily" },
    { id: "g2", title: "Ders Çalışma Süresi", targetCount: 4, currentCount: 3, unit: "Saat", type: "daily" },
    { id: "g3", title: "Paragraf & Problem", targetCount: 40, currentCount: 40, unit: "Soru", type: "daily" },

    { id: "g4", title: "TYT / AYT Denemesi", targetCount: 3, currentCount: 2, unit: "Deneme", type: "weekly" },
    { id: "g5", title: "Konu Bitirme", targetCount: 5, currentCount: 3, unit: "Konu", type: "weekly" },

    { id: "g6", title: "Toplam Soru Hedefi", targetCount: 4000, currentCount: 2800, unit: "Soru", type: "monthly" },
    { id: "g7", title: "Genel Deneme Serisi", targetCount: 10, currentCount: 6, unit: "Deneme", type: "monthly" },
  ]);

  const filteredGoals = goals.filter((g) => g.type === activeTab);

  const toggleIncrement = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextCount = Math.min(g.targetCount, g.currentCount + (g.unit === "Soru" ? 10 : 1));
          return { ...g, currentCount: nextCount };
        }
        return g;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("daily")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "daily"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Günlük Hedefler
        </button>
        <button
          onClick={() => setActiveTab("weekly")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "weekly"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Haftalık Hedefler
        </button>
        <button
          onClick={() => setActiveTab("monthly")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "monthly"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Aylık Hedefler
        </button>
      </div>

      {/* Goal Items */}
      <div className="space-y-3">
        {filteredGoals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentCount / goal.targetCount) * 100));
          return (
            <div
              key={goal.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 rounded-xl space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {goal.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {goal.currentCount} / {goal.targetCount} {goal.unit} (%{percent})
                  </span>
                  {percent < 100 && (
                    <button
                      onClick={() => toggleIncrement(goal.id)}
                      className="px-2 py-0.5 text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-200"
                    >
                      + İlerle
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    percent >= 100 ? "bg-emerald-500" : "bg-blue-600"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
