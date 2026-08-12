"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, LogIn } from "lucide-react";
import Link from "next/link";

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">
            Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-5">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Giriş Gerekli
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Bu sayfayı görüntülemek için önce giriş yapmanız gerekiyor.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  const role = userProfile?.role;

  if (role !== "admin" && role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Erişim Reddedildi
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Bu sayfayı görüntülemek için yönetici yetkisine sahip olmanız gerekiyor.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white font-semibold text-sm transition-colors"
          >
            Panele Dön
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};