import { Check, Pause, Play, RotateCcw } from "lucide-react";
import { MODE_GRADIENTS } from "../constants";
import type { PomodoroMode } from "../types";

interface Props { mode: PomodoroMode; isRunning: boolean; onToggle: () => void; onReset: () => void; onSkip: () => void; }
export function TimerControls({ mode, isRunning, onToggle, onReset, onSkip }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={onReset} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-all hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" title="Sıfırla"><RotateCcw className="h-4 w-4" /></button>
      <button type="button" onClick={onToggle} className={`flex items-center gap-2 rounded-xl bg-gradient-to-br px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${MODE_GRADIENTS[mode]}`}>
        {isRunning ? <><Pause className="h-4 w-4" />Durdur</> : <><Play className="h-4 w-4" />Başlat</>}
      </button>
      <button type="button" onClick={onSkip} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-all hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" title="Atla"><Check className="h-4 w-4" /></button>
    </div>
  );
}
