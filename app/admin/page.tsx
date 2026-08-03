import type { Metadata } from "next";
import { AdminGuard } from "../../components/auth/AdminGuard";
import { AdminDashboard } from "../../components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Yönetici Paneli",
  description: "YKS Koçu platform yönetimi",
};

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboard />
        </div>
      </div>
    </AdminGuard>
  );
}
