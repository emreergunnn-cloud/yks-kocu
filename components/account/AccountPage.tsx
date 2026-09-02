"use client";

import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AccountIdentityCard } from "./AccountIdentityCard";
import { AccountSecurity } from "./AccountSecurity";

export function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-4 md:p-6">
        <div className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-40 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 md:p-6">
      <header>
        <h1 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          Hesap ve Güvenlik
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Giriş yöntemlerinizi ve hesap güvenliğinizi yönetin.
        </p>
      </header>

      <AccountIdentityCard user={user} />
      <AccountSecurity user={user} />
    </div>
  );
}
