import {
  PRESETS,
} from "./constants";

import type {
  Preset,
} from "./types";

interface Props {
  value: Preset;

  onChange:
    (preset: Preset) =>
      void;
}

export function PresetSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex gap-2">
      {PRESETS.map(
        (preset) => (
          <button
            key={
              preset.label
            }
            type="button"
            onClick={() =>
              onChange(
                preset
              )
            }
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              value.label ===
              preset.label
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
            {preset.label}
          </button>
        )
      )}
    </div>
  );
}
