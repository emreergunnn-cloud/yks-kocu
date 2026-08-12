"use client";

import React from "react";
import {
  Users,
  BookOpen,
  BarChart3,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalExams: number;
  totalStudySessions: number;
}

interface AdminStatsCardsProps {
  stats: AdminStats;
  loading: boolean;
}

const StatCard = ({
  icon,
  label,
  value,
  color,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  loading: boolean;
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </div>

        {loading ? (
          <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        ) : (
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
};

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({
  stats,
  loading,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        icon={<Users className="h-6 w-6 text-blue-600" />}
        label="Toplam Kullanıcı"
        value={stats.totalUsers}
        color="bg-blue-100 dark:bg-blue-900/30"
        loading={loading}
      />

      <StatCard
        icon={<BookOpen className="h-6 w-6 text-emerald-600" />}
        label="Toplam Deneme"
        value={stats.totalExams}
        color="bg-emerald-100 dark:bg-emerald-900/30"
        loading={loading}
      />

      <StatCard
        icon={<BarChart3 className="h-6 w-6 text-violet-600" />}
        label="Toplam Çalışma Oturumu"
        value={stats.totalStudySessions}
        color="bg-violet-100 dark:bg-violet-900/30"
        loading={loading}
      />
    </div>
  );
};