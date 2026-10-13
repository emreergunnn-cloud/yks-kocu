import { Check, Clock3 } from "lucide-react";
import { PREMIUM_FEATURES } from "@/lib/premium/features";

export function PremiumFeatureList() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {PREMIUM_FEATURES.map((feature) => {
        const premium = feature.requiredPlan === "premium";
        const planned = feature.status === "planned";
        return (
          <div key={feature.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 rounded-full p-1 ${premium ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}`}>
                {planned ? <Clock3 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900 dark:text-white">{feature.title}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {premium ? "Premium" : "Ücretsiz"}
                  </span>
                  {planned && <span className="text-xs text-amber-600 dark:text-amber-400">Yakında</span>}
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
