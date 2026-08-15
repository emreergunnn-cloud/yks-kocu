"use client";

import {
  CalendarDays,
} from "lucide-react";

import {
  CalendarClearButton,
} from "./CalendarClearButton";

interface Props {
  onClear:
    () => Promise<void>;
}

export function CalendarHeader({
  onClear,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600" />

          Takvim
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Çalışma planı ve etkinlik takibi
        </p>
      </div>

      <CalendarClearButton
        label="Takvimi Temizle"
        onConfirm={onClear}
      />
    </div>
  );
}