"use client";

import { Check, Save, TimerReset } from "lucide-react";
import { PresetSelector } from "./PresetSelector";
import { usePomodoroSettings } from "./hooks/usePomodoroSettings";
import type { Preset } from "./types";

interface Props {
  preset: Preset;
  isRunning: boolean;
  onApply: (preset: Preset) => void;
}

const FIELDS = [
  { key: "work", label: "Çalışma", min: 10, max: 120 },
  { key: "short", label: "Kısa mola", min: 1, max: 30 },
  { key: "long", label: "Uzun mola", min: 5, max: 60 },
] as const;

export function PomodoroSettingsPanel({ preset, isRunning, onApply }: Props) {
  const form = usePomodoroSettings({ preset, onApply });

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <TimerReset className="h-4 w-4 text-blue-500" /> Pomodoro Süreleri
          </h2>
          <p className="mt-1 text-xs text-slate-500">Hızlı seçim yap veya kendi sürelerini belirle.</p>
        </div>
        <PresetSelector value={preset} onChange={form.applyPreset} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {FIELDS.map((field) => (
          <label key={field.key} className="space-y-1.5 text-xs text-slate-500">
            <span>{field.label}</span>
            <div className="relative">
              <input
                type="number"
                min={field.min}
                max={field.max}
                value={form.values[field.key]}
                disabled={isRunning}
                onChange={(event) => form.update(field.key, Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-9 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">dk</span>
            </div>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs">
          {isRunning && <span className="text-amber-500">Süreleri değiştirmek için zamanlayıcıyı duraklat.</span>}
          {form.error && <span className="text-red-500">{form.error}</span>}
          {form.saved && !form.error && <span className="flex items-center gap-1 text-emerald-500"><Check className="h-3.5 w-3.5" /> Varsayılan süreler kaydedildi.</span>}
        </div>
        <button
          type="button"
          disabled={isRunning || form.saving}
          onClick={() => void form.save()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {form.saving ? "Kaydediliyor..." : "Uygula ve Kaydet"}
        </button>
      </div>
    </section>
  );
}
