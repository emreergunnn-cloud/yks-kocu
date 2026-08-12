"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface SuperAdminActionsProps {
  isSuperAdmin: boolean;
}

export const SuperAdminActions: React.FC<SuperAdminActionsProps> = ({
  isSuperAdmin,
}) => {
  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

        <div>
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            Baş Admin Yetkileri
          </p>

          <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-400">
            Baş Admin, kullanıcıların Admin yetkilerini
            değiştirebilir. Baş Admin hesabının yetkisi
            normal Admin işlemleriyle değiştirilemez.
          </p>
        </div>
      </div>
    </div>
  );
};