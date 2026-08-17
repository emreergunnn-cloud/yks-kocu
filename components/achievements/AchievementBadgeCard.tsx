import {
  Star,
} from "lucide-react";

import type {
  AchievementBadge,
} from "./types";

interface Props {
  badge:
    AchievementBadge;
}

export function AchievementBadgeCard({
  badge,
}: Props) {
  const Icon =
    badge.icon;

  const percent =
    badge.max
      ? Math.min(
          100,
          (
            (
              badge.progress ??
              0
            ) /
            badge.max
          ) *
            100
        )
      : 0;

  return (
    <div
      className={`space-y-2 rounded-xl border bg-white p-4 transition-all dark:bg-slate-900 ${
        badge.earned
          ? "border-amber-300 shadow-sm dark:border-amber-700"
          : "border-slate-200 opacity-60 dark:border-slate-800"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          badge.earned
            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p
          className={`text-sm font-semibold ${
            badge.earned
              ? "text-slate-900 dark:text-white"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {badge.title}
        </p>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          {
            badge.description
          }
        </p>
      </div>

      {badge.max &&
        !badge.earned && (
          <div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{
                  width:
                    `${percent}%`,
                }}
              />
            </div>

            <p className="mt-0.5 text-[10px] text-slate-400">
              {badge.progress ??
                0}
              /{badge.max}
            </p>
          </div>
        )}

      {badge.earned && (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
          <Star className="h-3 w-3" />

          Kazanıldı
        </span>
      )}
    </div>
  );
}
