import {
  CalendarCheck,
} from "lucide-react";

export function AssignedTasksNotice() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
      <div className="flex items-center gap-2">
        <CalendarCheck className="h-4 w-4 text-emerald-600" />

        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          Ödevlerin takvimde
        </p>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Bu plandaki ödevler
        takvime aktarıldı.
        Sonuç girişini Takvim
        sayfasından yapabilirsin.
      </p>
    </div>
  );
}