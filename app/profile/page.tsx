"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { AppLayout } from "../../components/layout/AppLayout";
import Link from "next/link";

export default function ProfilePage() {
  const { user, userProfile, logout } = useAuth();

  if (!user) return null;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "Kullanıcı"}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-2xl ring-4 ring-blue-500/20">
                {(user.displayName || "K").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {userProfile?.adSoyad || user.displayName || "Kullanıcı"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              {userProfile?.alan && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    {userProfile.alan}
                  </span>
                  {userProfile.sinif && (
                    <span className="px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                      {userProfile.sinif}. Sınıf
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              YKS Hedef Bilgileri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl">
                <span className="text-xs text-slate-500 dark:text-slate-400">Hedef Bölüm</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {userProfile?.hedefBolum || "Belirtilmedi"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl">
                <span className="text-xs text-slate-500 dark:text-slate-400">Hedef Sıralama</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {userProfile?.hedefSiralama ? `#${userProfile.hedefSiralama}` : "Belirtilmedi"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto text-center px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm font-medium transition-all"
            >
              Hedefleri Düzenle
            </Link>
            <button
              onClick={logout}
              className="w-full sm:w-auto text-center px-5 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/70 rounded-xl text-sm font-medium transition-all"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
