import { formatTime, MODE_LABELS } from "../constants";
import type { PomodoroMode } from "../types";

interface Props { mode: PomodoroMode; timeLeft: number; progress: number; }
const circumference = 2 * Math.PI * 90;

function gradientColors(mode: PomodoroMode) {
  if (mode === "pomodoro") return ["#3b82f6", "#1d4ed8"];
  if (mode === "short_break") return ["#10b981", "#059669"];
  return ["#8b5cf6", "#7c3aed"];
}

export function TimerRing({ mode, timeLeft, progress }: Props) {
  const [start, end] = gradientColors(mode);
  return (
    <div className="relative h-52 w-52">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#timerGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * progress) / 100} className="transition-all duration-300" />
        <defs><linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={start} /><stop offset="100%" stopColor={end} /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-black text-slate-900 dark:text-white">{formatTime(timeLeft)}</span>
        <span className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{MODE_LABELS[mode]}</span>
      </div>
    </div>
  );
}
