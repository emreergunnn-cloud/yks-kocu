import type {
  RecentTimerSession,
} from "./types";

interface Props {
  cycleCount: number;

  todayMinutes: number;
  todaySessions: number;

  recentSessions:
    RecentTimerSession[];

  saving: boolean;
}

export function StudyTimerSidebar({
  cycleCount,
  todayMinutes,
  todaySessions,
  recentSessions,
  saving,
}: Props) {
  const cycleProgress =
    cycleCount % 4;

  return (
    <div className="space-y-3">
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Döngü
        </p>

        <div className="grid grid-cols-4 gap-1.5">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className={`h-2.5 rounded-full ${
                  index <
                  cycleProgress
                    ? "bg-blue-500"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            )
          )}
        </div>

        <p className="text-xs text-slate-400">
          Her 4 tamamlanan pomodorodan sonra uzun mola
        </p>
      </div>

      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Bugün
        </p>

        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Çalışma
          </span>

          <span className="font-semibold text-slate-900 dark:text-white">
            {todayMinutes} dk
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Seans
          </span>

          <span className="font-semibold text-slate-900 dark:text-white">
            {todaySessions}
          </span>
        </div>

        {saving && (
          <p className="pt-1 text-xs text-blue-500">
            Seans kaydediliyor...
          </p>
        )}
      </div>

      {recentSessions.length >
        0 && (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Son Seanslar
          </p>

          <div className="space-y-1.5">
            {recentSessions.map(
              (
                session,
                index
              ) => (
                <div
                  key={`${session.ts.getTime()}-${index}`}
                  className="flex justify-between gap-2 text-xs"
                >
                  <span className="truncate text-slate-600 dark:text-slate-400">
                    {
                      session.subject
                    }
                  </span>

                  <span className="shrink-0 text-slate-500">
                    {Math.round(
                      session.duration /
                        60
                    )}{" "}
                    dk
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
