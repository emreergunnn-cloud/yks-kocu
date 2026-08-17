import {
  Timer,
} from "lucide-react";

import type {
  UserSettings,
} from "@/services/settingsService";

interface Props {
  settings:
    UserSettings;

  onChange:
    (
      values:
        Partial<UserSettings>
    ) => void;
}

const OPTIONS = [
  {
    key:
      "pomodoroLength",
    label:
      "Çalışma süresi",
    min: 10,
    max: 120,
    step: 5,
  },
  {
    key:
      "breakLength",
    label:
      "Kısa mola",
    min: 1,
    max: 30,
    step: 1,
  },
  {
    key:
      "longBreakLength",
    label:
      "Uzun mola",
    min: 5,
    max: 60,
    step: 5,
  },
] as const;

export function SettingsPomodoro({
  settings,
  onChange,
}: Props) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
        <Timer className="h-4 w-4" />
        Pomodoro
      </h2>

      {OPTIONS.map(
        (item) => (
          <div
            key={
              item.key
            }
          >
            <div className="mb-1.5 flex justify-between">
              <label className="text-sm text-slate-600 dark:text-slate-400">
                {item.label}
              </label>

              <span className="text-sm font-semibold">
                {
                  settings[
                    item.key
                  ]
                }{" "}
                dk
              </span>
            </div>

            <input
              type="range"
              min={item.min}
              max={item.max}
              step={
                item.step
              }
              value={
                settings[
                  item.key
                ]
              }
              onChange={(
                event
              ) =>
                onChange({
                  [item.key]:
                    Number(
                      event
                        .target
                        .value
                    ),
                })
              }
              className="w-full accent-blue-600"
            />
          </div>
        )
      )}
    </section>
  );
}
