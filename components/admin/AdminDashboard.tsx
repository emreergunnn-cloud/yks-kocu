"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

import {
  getAdminStats,
  getAdminUsers,
  AdminUserRow,
} from "../../services/adminService";

import { useAuth } from "../../context/AuthContext";

import { AdminStatsCards } from "./AdminStatsCards";
import { AdminUserTable } from "./AdminUserTable";
import { SuperAdminActions } from "./SuperAdminActions";

export const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  const isSuperAdmin = userProfile?.role === "superadmin";

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalStudySessions: 0,
  });

  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    setStatsLoading(true);
    setUsersLoading(true);

    try {
      const [statsData, usersData] = await Promise.all([
        getAdminStats(),
        getAdminUsers(100),
      ]);

      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Veriler yüklenirken bir hata oluştu."
      );
    } finally {
      setStatsLoading(false);
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Yönetici Paneli
          </h1>

          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Platform genelindeki istatistikler ve kullanıcı yönetimi
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={statsLoading || usersLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              statsLoading || usersLoading ? "animate-spin" : ""
            }`}
          />
          Yenile
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />

          <span className="flex-1">{error}</span>

          <button
            type="button"
            onClick={() => setError(null)}
            className="rounded-lg p-1 hover:bg-rose-100 dark:hover:bg-rose-900/40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
          <Check className="h-5 w-5 shrink-0" />

          <span className="flex-1">{success}</span>

          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="rounded-lg p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <AdminStatsCards
        stats={stats}
        loading={statsLoading}
      />

      <SuperAdminActions
        isSuperAdmin={isSuperAdmin}
      />

      <AdminUserTable
        users={users}
        loading={usersLoading}
        search={search}
        onSearchChange={setSearch}
        actionLoading={null}
        canManageUsers={isSuperAdmin}
        onRoleChange={(uid, role) => {
          setUsers((current) =>
            current.map((user) =>
              user.uid === uid
                ? { ...user, role }
                : user
            )
          );

          setSuccess(
            role === "admin"
              ? "Kullanıcı Admin yapıldı."
              : "Admin yetkisi kaldırıldı."
          );
        }}
        onDelete={(uid) => {
          setUsers((current) =>
            current.filter((user) => user.uid !== uid)
          );

          setStats((current) => ({
            ...current,
            totalUsers: Math.max(0, current.totalUsers - 1),
          }));

          setSuccess("Kullanıcı başarıyla silindi.");
        }}
      />

      <p className="text-center text-xs text-slate-400 dark:text-slate-600">
        Yönetici Paneli · YKS Koçu v1.0 · Son {users.length} kullanıcı gösteriliyor
      </p>
    </div>
  );
};

