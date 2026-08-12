"use client";

import { useCallback, useEffect, useState } from "react";
import {
Users,
BookOpen,
BarChart3,
} from "lucide-react";

import {
getAdminStats,
getAdminUsers,
AdminStats,
AdminUserRow,
} from "../../../services/adminService";

import { AdminHeader } from "../shared/AdminHeader";
import { StatCard } from "../shared/StatCard";
import { RoleBadge } from "../shared/RoleBadge";

export function AdminPanel() {
const [stats, setStats] = useState<AdminStats>({
totalUsers: 0,
totalExams: 0,
totalStudySessions: 0,
});

const [users, setUsers] = useState<AdminUserRow[]>([]);
const [loading, setLoading] = useState(true);

const loadData = useCallback(async () => {
setLoading(true);

try {
  const [statsData, usersData] = await Promise.all([
    getAdminStats(),
    getAdminUsers(100),
  ]);

  setStats(statsData);
  setUsers(usersData);
} catch (error) {
  console.error("Admin verileri yüklenemedi:", error);
} finally {
  setLoading(false);
}

}, []);

useEffect(() => {
void loadData();
}, [loadData]);

return ( <div className="space-y-6"> <AdminHeader
     title="Yönetici Paneli"
     description="Platform istatistikleri ve kullanıcı görüntüleme."
     onRefresh={loadData}
     loading={loading}
   />

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard
      icon={Users}
      title="Toplam Kullanıcı"
      value={loading ? "..." : stats.totalUsers}
    />

    <StatCard
      icon={BookOpen}
      title="Toplam Deneme"
      value={loading ? "..." : stats.totalExams}
    />

    <StatCard
      icon={BarChart3}
      title="Toplam Çalışma"
      value={loading ? "..." : stats.totalStudySessions}
    />
  </div>

  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="border-b border-slate-200 p-4 dark:border-slate-800">
      <h2 className="font-semibold text-slate-900 dark:text-white">
        Kullanıcılar
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        Admin hesabı kullanıcı yetkilerini değiştiremez.
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="px-4 py-3 text-left">Kullanıcı</th>
            <th className="px-4 py-3 text-left">E-posta</th>
            <th className="px-4 py-3 text-left">Rol</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user) => (
            <tr key={user.uid}>
              <td className="px-4 py-3 font-medium">
                {user.adSoyad}
              </td>

              <td className="px-4 py-3 text-slate-500">
                {user.email}
              </td>

              <td className="px-4 py-3">
                <RoleBadge role={user.role} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

);
}
