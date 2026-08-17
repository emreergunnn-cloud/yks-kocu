import type {
  PomodoroMode,
  Preset,
} from "./types";

export const PRESETS: Preset[] = [
  {
    label: "25/5",
    work: 25,
    short: 5,
    long: 15,
  },
  {
    label: "50/10",
    work: 50,
    short: 10,
    long: 20,
  },
  {
    label: "90/20",
    work: 90,
    short: 20,
    long: 30,
  },
];

export const MODE_LABELS:
  Record<PomodoroMode, string> = {
    pomodoro: "Çalışma",
    short_break: "Kısa Mola",
    long_break: "Uzun Mola",
  };

export const MODE_GRADIENTS:
  Record<PomodoroMode, string> = {
    pomodoro:
      "from-blue-500 to-blue-700",

    short_break:
      "from-emerald-500 to-emerald-700",

    long_break:
      "from-violet-500 to-violet-700",
  };

export function getModeSeconds(
  preset: Preset,
  mode: PomodoroMode
) {
  if (mode === "pomodoro") {
    return preset.work * 60;
  }

  if (mode === "short_break") {
    return preset.short * 60;
  }

  return preset.long * 60;
}

export function formatTime(
  seconds: number
) {
  const minutes = Math.floor(
    seconds / 60
  )
    .toString()
    .padStart(2, "0");

  const secs = (
    seconds % 60
  )
    .toString()
    .padStart(2, "0");

  return `${minutes}:${secs}`;
}
