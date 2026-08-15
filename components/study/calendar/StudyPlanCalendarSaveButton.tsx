"use client";

import {
  CalendarDays,
  Check,
  Loader2,
} from "lucide-react";

interface Props {
  saving: boolean;
  saved: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function StudyPlanCalendarSaveButton({
  saving,
  saved,
  disabled,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold transition-all"
    >
      <ButtonIcon
        saving={saving}
        saved={saved}
      />

      {saving
        ? "Ekleniyor..."
        : saved
          ? "Eklendi"
          : "Takvime Ekle"}
    </button>
  );
}

function ButtonIcon({
  saving,
  saved,
}: {
  saving: boolean;
  saved: boolean;
}) {
  if (saving) {
    return (
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
    );
  }

  if (saved) {
    return (
      <Check className="w-3.5 h-3.5" />
    );
  }

  return (
    <CalendarDays className="w-3.5 h-3.5" />
  );
}
