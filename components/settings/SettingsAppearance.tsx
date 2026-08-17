import {
  Monitor,
  Moon,
  Sun,
} from "lucide-react";

import type {
  UserSettings,
} from "@/services/settingsService";

interface Props {
  theme:
    UserSettings["theme"];

  onChange:
    (
      value:
        UserSettings["theme"]
    ) => void;
}

const OPTIONS = [
  {
    value: "light",
    label: "Açık",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Koyu",
    Icon: Moon,
  },
  {
    value: "system",
    label: "Sistem",
    Icon: Monitor,
  },
] as const;

export function SettingsAppearance({
  theme,
  onChange,
}: Props) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
        <Monitor className="h-4 w-4" />
        Görünüm
      </h2>

      <div className="flex gap-2">
        {OPTIONS.map(
          ({
            value,
            label,
            Icon,
          }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                onChange(
                  value
                )
              }
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium ${
                theme === value
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                  : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          )
        )}
      </div>
    </section>
  );
}
