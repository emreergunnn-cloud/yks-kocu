import Link from "next/link";

import {
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export function StudyPlanEmptyState() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
      <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />

      <h3 className="font-semibold">
        Bugün için plan oluşturulamadı
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Konu durumlarını kontrol edebilirsin.
      </p>

      <Link
        href="/subjects"
        className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 font-medium"
      >
        Konulara Git
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}