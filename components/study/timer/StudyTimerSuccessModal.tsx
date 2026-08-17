import Link from "next/link";

import {
  Check,
} from "lucide-react";

import type {
  RecentTimerSession,
} from "./types";

interface Props {
  session:
    RecentTimerSession;

  onClose: () => void;
}

export function StudyTimerSuccessModal({
  session,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <Check className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Seans Tamamlandı 🎉
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {session.subject}
            </span>{" "}
            çalışmasını tamamladın.
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {Math.round(
              session.duration /
                60
            )}{" "}
            dakikalık çalışma kaydedildi.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/dashboard"
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700"
          >
            AI Koç&apos;a Dön
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-sm font-semibold text-slate-500 transition-all hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
