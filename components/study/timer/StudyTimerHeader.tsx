import {
  Timer,
} from "lucide-react";

interface Props {
  minutes: number;
  sessions: number;
  error?: string | null;
}

export function StudyTimerHeader({
  minutes,
  sessions,
  error,
}: Props) {
  return (
    <div>
      <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <Timer className="h-5 w-5 text-blue-600" />

        Çalışma Zamanlayıcı
      </h1>

      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
        Bugün {minutes} dakika çalıştın • {sessions} seans kaydedildi
      </p>

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
