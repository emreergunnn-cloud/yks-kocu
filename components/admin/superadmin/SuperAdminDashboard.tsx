"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, ShieldCheck, Activity, RefreshCw } from "lucide-react";

import { getAdminStats, AdminStats } from "../../../services/adminService";
import { AdminHeader } from "../shared/AdminHeader";
import { StatCard } from "../shared/StatCard";
import { SuperAdminUsers } from "./SuperAdminUsers";

export function SuperAdminDashboard(): React.ReactElement {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalExams: 0,
    totalStudySessions: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/stats");

      if (!response.ok) {
        throw new Error("İstatistikler alınamadı.");
      }

      const data = await response.json();

      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalExams: data.totalExams ?? 0,
        totalStudySessions: data.totalStudySessions ?? 0,
      });
    } catch (error) {
      console.error("Superadmin istatistikleri alınamadı:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Superadmin Paneli"
        description="Platformun tamamını yönetin ve sistem istatistiklerini görüntüleyin."
        onRefresh={loadStats}
        loading={loading}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Toplam Kullanıcı"
          value={loading ? "..." : stats.totalUsers}
          icon={Users}
          color="bg-blue-100 dark:bg-blue-900/30"
          loading={loading}
        />

        <StatCard
          title="Toplam Deneme"
          value={loading ? "..." : stats.totalExams}
          icon={ShieldCheck}
          color="bg-emerald-100 dark:bg-emerald-900/30"
          loading={loading}
        />

        <StatCard
          title="Toplam Çalışma"
          value={loading ? "..." : stats.totalStudySessions}
          icon={Activity}
          color="bg-violet-100 dark:bg-violet-900/30"
          loading={loading}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Kullanıcı Yönetimi
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sistemdeki kullanıcıları görüntüleyin.
              </p>
            </div>

            <button
              type="button"
              onClick={loadStats}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              Yenile
            </button>
          </div>
        </div>

        <div className="p-4">
          <SuperAdminUsers />
        </div>
      </div>
    </div>
  );
}
