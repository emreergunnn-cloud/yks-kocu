"use client";

import React from "react";
import { Flame, Trophy, Calendar } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";

export const StreakCard: React.FC = () => {
  const { streak, loading } = useStreak();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-32 animate-pulse">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const current = streak?.currentStreak || 0;
  const longest = streak?.longestStreak || 0;
  const total = streak?.totalStudyDays || 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Current Streak */}
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            current > 0 
              ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/20" 
              : "bg-slate-100 dark:bg-slate-800 text-slate-400"
          }`}>
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mevcut Seri</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-3xl font-black ${current > 0 ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                {current}
              </span>
              <span className="text-sm font-medium text-slate-500">gün</span>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-slate-200 dark:bg-slate-800"></div>

        {/* Stats */}
        <div className="flex w-full md:w-auto items-center gap-8 justify-between md:justify-end">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">En Uzun Seri</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{longest} <span className="text-sm font-medium text-slate-500">gün</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Toplam Çalışma</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{total} <span className="text-sm font-medium text-slate-500">gün</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
