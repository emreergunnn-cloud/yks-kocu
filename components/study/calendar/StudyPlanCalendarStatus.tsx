import type { StudyPlanMode } from "./types";

interface Props {
  mode: StudyPlanMode;
  minutes: number;
  error: string | null;
}

export function StudyPlanCalendarStatus({
  mode,
  minutes,
  error,
}: Props) {
  return (
    <>
      <p className="mt-3 text-[11px] text-slate-400">
        {mode === "daily"
          ? `Bugün için yaklaşık ${minutes} dakika çalışma eklenecek.`
          : `7 günün her biri için yaklaşık ${minutes} dakika ve birbirinden farklı konular oluşturulacak.`}
      </p>

      {error && (
        <p className="mt-3 text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </>
  );
}