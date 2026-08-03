"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

/**
 * Guards a page that requires authentication.
 * - While auth state is resolving → shows a centered spinner.
 * - If the user is not authenticated → redirects to /login.
 * - If the user is authenticated → renders children.
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Still resolving auth state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Yükleniyor…</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect is in progress, show nothing
  if (!user) {
    return null;
  }

  return <>{children}</>;
};
