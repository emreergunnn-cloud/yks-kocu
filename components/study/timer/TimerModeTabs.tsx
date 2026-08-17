import {
  MODE_LABELS,
} from "./constants";

import type {
  PomodoroMode,
} from "./types";

interface Props {
  mode: PomodoroMode;

  onChange:
    (
      mode:
        PomodoroMode
    ) => void;
}

const MODES:
  PomodoroMode[] = [
    "pomodoro",
    "short_break",
    "long_break",
  ];

export function TimerModeTabs({
  mode,
  onChange,
}: Props) {
  return (
    <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {MODES.map(
        (item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              onChange(item)
            }
            className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
              mode === item
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {
              MODE_LABELS[
                item
              ]
            }
          </button>
        )
      )}
    </div>
  );
}
