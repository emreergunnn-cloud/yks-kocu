"use client";

import { useAuth } from "@/context/AuthContext";
import { isSchoolGrade } from "@/lib/constants/curriculum/config";

export function AnalyticsHeader() {
  const { userProfile } = useAuth();
  const schoolMode = isSchoolGrade(userProfile?.sinif ?? "");

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Performans & Detaylı İstatistikler</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {schoolMode
          ? `${userProfile?.sinif}. sınıf ders ilerlemen, çalışma süren ve konu eksiklerin.`
          : "TYT/AYT net trendlerin, ders başarıların ve çalışma eksiklerin."}
      </p>
    </div>
  );
}
