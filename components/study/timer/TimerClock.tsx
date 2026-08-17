import {
  Check,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

import {
  formatTime,
  getModeSeconds,
  MODE_GRADIENTS,
  MODE_LABELS,
} from "./constants";

import type {
  PomodoroMode,
  Preset,
} from "./types";

interface Props {
  preset: Preset;
  mode: PomodoroMode;

  timeLeft: number;
  isRunning: boolean;

  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerClock({
  preset,
  mode,
  timeLeft,
  isRunning,
  onToggle,
  onReset,
  onSkip,
}: Props) {
  const total =
    getModeSeconds(
      preset,
      mode
    );

  const progress =
    total > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (
              (total -
                timeLeft) /
              total
            ) * 100
          )
        )
      : 0;

  const circumference =
    2 * Math.PI * 90;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-52 w-52">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-100 dark:text-slate-800"
          />

          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#timerGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={
              circumference
            }
            strokeDashoffset={
              circumference -
              (
                circumference *
                progress
              ) /
                100
            }
            className="transition-all duration-300"
          />

          <defs>
            <linearGradient
              id="timerGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor={
                  mode ===
                  "pomodoro"
                    ? "#3b82f6"
                    : mode ===
                        "short_break"
                      ? "#10b981"
                      : "#8b5cf6"
                }
              />

              <stop
                offset="100%"
                stopColor={
                  mode ===
                  "pomodoro"
                    ? "#1d4ed8"
                    : mode ===
                        "short_break"
                      ? "#059669"
                      : "#7c3aed"
                }
              />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-black text-slate-900 dark:text-white">
            {formatTime(
              timeLeft
            )}
          </span>

          <span className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {
              MODE_LABELS[
                mode
              ]
            }
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-all hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          title="Sıfırla"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center gap-2 rounded-xl bg-gradient-to-br px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${
            MODE_GRADIENTS[
              mode
            ]
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              Durdur
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Başlat
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-all hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          title="Atla"
        >
          <Check className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
