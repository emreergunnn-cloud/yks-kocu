"use client";

import {
  Calendar,
  CalendarDays,
} from "lucide-react";

import type { StudyPlanMode } from "./types";

interface Props {
  mode: StudyPlanMode;
  disabled: boolean;

  onChange:
    (mode: StudyPlanMode) => void;
}

export function StudyPlanCalendarModeButtons({
  mode,
  disabled,
  onChange,
}: Props) {
  return (
    <>
      <ModeButton
        active={mode === "daily"}
        disabled={disabled}
        icon={
          <Calendar className="w-3.5 h-3.5" />
        }
        label="Günlük"
        onClick={() =>
          onChange("daily")
        }
      />

      <ModeButton
        active={mode === "weekly"}
        disabled={disabled}
        icon={
          <CalendarDays className="w-3.5 h-3.5" />
        }
        label="Haftalık"
        onClick={() =>
          onChange("weekly")
        }
      />
    </>
  );
}

interface ModeButtonProps {
  active: boolean;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function ModeButton({
  active,
  disabled,
  icon,
  label,
  onClick,
}: ModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
        active
          ? "bg-blue-600 text-white"
          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}