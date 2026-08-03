"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, LogIn } from "lucide-react";
import Link from "next/link";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Renders children only when the authenticated user has role === "admin".
 * Shows a loading skeleton, an unauthenticated prompt, or a permission-denied
 * screen depending on state.
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, userProfile, loading } = useAuth();

  // Auth is still resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Yükleniyor…</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Giriş Gerekli</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Bu sayfayı görüntülemek için önce giriş yapmanız gerekiyor.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors text-sm"
          >
            <LogIn className="w-4 h-4" />
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (userProfile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Erişim Reddedildi</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Bu sayfayı görüntülemek için yönetici yetkisine sahip olmanız gerekiyor.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-2.5 px-6 rounded-xl transition-colors text-sm"
          >
            Panele Dön
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
