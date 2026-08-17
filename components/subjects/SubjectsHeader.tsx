import {
  BookOpen,
} from "lucide-react";

interface Props {
  completed: number;
  total: number;
}

export function SubjectsHeader({
  completed,
  total,
}: Props) {
  const percent =
    total > 0
      ? Math.round(
          (
            completed /
            total
          ) * 100
        )
      : 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Konu Takip
        </h1>

        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {completed}/{total} konu tamamlandı — %{percent}
        </p>
      </div>

      <div className="w-full sm:w-48">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width:
                `${percent}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
