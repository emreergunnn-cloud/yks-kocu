"use client";

import { Crown } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";
import { PremiumFeatureList } from "./PremiumFeatureList";
import { PremiumPlanCards } from "./PremiumPlanCards";
import { PremiumPreviewPanel } from "./PremiumPreviewPanel";

export function PremiumPage() {
  const { isPremium, loading } = usePremium();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Crown className="h-7 w-7 text-amber-500" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">YKS Koçu Premium</h1>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Temel çalışma özellikleri ücretsiz kalır. Premium, daha derin analiz ve kişiselleştirme katmanı olacak.</p>
        {!loading && isPremium && <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">Bu hesap Premium yetkisine sahip.</p>}
      </div>
      <PremiumPlanCards />
      <PremiumFeatureList />
      <PremiumPreviewPanel />
    </div>
  );
}
