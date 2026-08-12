"use client";

import { useEffect, useState } from "react";
import {
Activity,
ShieldCheck,
Users,
} from "lucide-react";

import { AdminHeader } from "../shared/AdminHeader";
import { StatCard } from "../shared/StatCard";
import { SuperAdminUsers } from "../superadmin/SuperAdminUsers";

interface SuperAdminStats {
totalUsers: number;
adminUsers: number;
studentUsers: number;
activeUsers: number;
}

export function SuperAdminDashboard() {
const [stats, setStats] = useState<SuperAdminStats>({
totalUsers: 0,
adminUsers: 0,
studentUsers: 0,
activeUsers: 0,
});

const [loading, setLoading] = useState(true);

useEffect(() => {
const loadStats = async () => {
try {
const response = await fetch("/api/admin/stats");

    if (!response.ok) {
      throw new Error("İstatistikler alınamadı.");
    }

    const data = await response.json();

    setStats({
      totalUsers: Number(data.totalUsers ?? 0),
      adminUsers: Number(data.adminUsers ?? 0),
      studentUsers: Number(data.studentUsers ?? 0),
      activeUsers: Number(data.activeUsers ?? 0),
    });
  } catch (error) {
    console.error(
      "Super admin istatistikleri yüklenemedi:",
      error
    );
  } finally {
    setLoading(false);
  }
};

void loadStats();

}, []);

return ( <div className="space-y-6"> <AdminHeader
     title="Süper Admin Paneli"
     description="Sistem kullanıcılarını, rollerini ve hesaplarını yönetin."
   />

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      title="Toplam Kullanıcı"
      value={loading ? "..." : stats.totalUsers}
      icon={Users}
    />

    <StatCard
      title="Admin"
      value={loading ? "..." : stats.adminUsers}
      icon={ShieldCheck}
    />

    <StatCard
      title="Öğrenci"
      value={loading ? "..." : stats.studentUsers}
      icon={Users}
    />

    <StatCard
      title="Aktif Kullanıcı"
      value={loading ? "..." : stats.activeUsers}
      icon={Activity}
    />
  </div>

  <SuperAdminUsers />
</div>

);
}
