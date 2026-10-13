import { Crown } from "lucide-react";

export function PremiumPlanCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">YKS Koçu Free</p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Ücretsiz</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Ders çalışmak için gereken temel araçlar ücretsiz kalır.</p>
      </div>
      <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-900 dark:from-amber-950/40 dark:to-slate-900">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
          <Crown className="h-5 w-5" />
          <p className="text-sm font-bold">YKS Koçu Premium</p>
        </div>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Hazırlanıyor</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Gelişmiş analiz, kişisel raporlar ve reklamsız deneyim için hazırlanıyor.</p>
        <button disabled className="mt-4 w-full cursor-not-allowed rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-500">
          Abonelik yakında
        </button>
      </div>
    </div>
  );
}
