"use client";

import { AdminGuard } from "../../components/auth/AdminGuard";
import { AdminDashboard } from "../../components/admin/AdminDashboard";
import { AppLayout } from "../../components/layout/AppLayout";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AppLayout>
        <div className="min-h-full bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminDashboard />
          </div>
        </div>
      </AppLayout>
    </AdminGuard>
  );
}