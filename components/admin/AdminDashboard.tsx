"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Users,
  BookOpen,
  BarChart3,
  RefreshCw,
  Shield,
  ChevronUp,
  ChevronDown,
  Search,
  AlertCircle,
} from "lucide-react";
import {
  getAdminStats,
  getAdminUsers,
  AdminStats,
  AdminUserRow,
} from "../../services/adminService";

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, loading }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
      {loading ? (
        <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mt-1" />
      ) : (
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
          {typeof value === "number" ? value.toLocaleString("tr-TR") : value}
        </p>
      )}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Role Badge
// ---------------------------------------------------------------------------
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const isAdmin = role === "admin";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
        isAdmin
          ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
      }`}
    >
      {isAdmin && <Shield className="w-3 h-3" />}
      {isAdmin ? "Admin" : "Öğrenci"}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Sort helpers
// ---------------------------------------------------------------------------
type SortKey = keyof AdminUserRow;
type SortDir = "asc" | "desc";

function sortRows(rows: AdminUserRow[], key: SortKey, dir: SortDir): AdminUserRow[] {
  return [...rows].sort((a, b) => {
    const av = String(a[key]).toLowerCase();
    const bv = String(b[key]).toLowerCase();
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalExams: 0, totalStudySessions: 0 });
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

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
    } catch {
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setStatsLoading(false);
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered + sorted rows
  const filteredUsers = sortRows(
    users.filter((u) => {
      const q = search.toLowerCase();
      return (
        u.adSoyad.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.alan.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }),
    sortKey,
    sortDir
  );

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon: React.FC<{ col: SortKey }> = ({ col }) => {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-blue-500" />
    ) : (
      <ChevronDown className="w-3 h-3 text-blue-500" />
    );
  };

  const headerCell = (label: string, key: SortKey) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      onClick={() => handleSort(key)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <SortIcon col={key} />
      </span>
    </th>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-violet-500" />
            Yönetici Paneli
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Platform genelindeki istatistikler ve kullanıcı yönetimi
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={statsLoading || usersLoading}
          className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium py-2 px-4 rounded-xl transition-all text-sm disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${statsLoading || usersLoading ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl p-4 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          label="Toplam Kullanıcı"
          value={stats.totalUsers}
          color="bg-blue-100 dark:bg-blue-900/30"
          loading={statsLoading}
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-emerald-600" />}
          label="Toplam Deneme"
          value={stats.totalExams}
          color="bg-emerald-100 dark:bg-emerald-900/30"
          loading={statsLoading}
        />
        <StatCard
          icon={<BarChart3 className="w-6 h-6 text-violet-600" />}
          label="Toplam Çalışma Oturumu"
          value={stats.totalStudySessions}
          color="bg-violet-100 dark:bg-violet-900/30"
          loading={statsLoading}
        />
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Kullanıcılar</h2>
            {!usersLoading && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {filteredUsers.length} / {users.length} kullanıcı gösteriliyor
              </p>
            )}
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Ad, e-posta, alan ara…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {usersLoading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Kullanıcılar yükleniyor…</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {search ? "Arama sonucu bulunamadı." : "Henüz kayıtlı kullanıcı yok."}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {headerCell("Ad Soyad", "adSoyad")}
                  {headerCell("E-posta", "email")}
                  {headerCell("Alan", "alan")}
                  {headerCell("Sınıf", "sinif")}
                  {headerCell("Rol", "role")}
                  {headerCell("Kayıt Tarihi", "createdAt")}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.uid}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.adSoyad !== "—"
                            ? u.adSoyad.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                          {u.adSoyad}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {u.alan}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {u.sinif}
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                      {u.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-center text-slate-400 dark:text-slate-600">
        Yönetici Paneli · YKS Koçu v1.0 · Son {users.length} kullanıcı gösteriliyor
      </p>
    </div>
  );
};
