"use client";

import { usePremium } from "@/hooks/usePremium";

export function PremiumPreviewPanel() {
  const { canPreview, plan, setPreviewPlan } = usePremium();
  if (!canPreview) return null;

  return (
    <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
      <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Geliştirici önizlemesi</p>
      <p className="mt-1 text-xs text-blue-700/80 dark:text-blue-400">Yalnızca localhost üzerinde çalışır; gerçek abonelik oluşturmaz.</p>
      <div className="mt-3 flex gap-2">
        {(["free", "premium"] as const).map((item) => (
          <button key={item} onClick={() => setPreviewPlan(item)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${plan === item ? "bg-blue-600 text-white" : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300"}`}>
            {item === "free" ? "Free göster" : "Premium göster"}
          </button>
        ))}
      </div>
    </div>
  );
}
