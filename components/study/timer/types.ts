export type PomodoroMode =
  | "pomodoro"
  | "short_break"
  | "long_break";

export interface Preset {
  label: string;
  work: number;
  short: number;
  long: number;
}

export interface RecentTimerSession {
  subject: string;
  duration: number;
  ts: Date;
}
