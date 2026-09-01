export interface StudySessionRecord {
  id?: string;
  uid: string;
  subject: string;
  duration: number;
  note?: string;
  startTime: unknown;
  endTime: unknown;
}

export interface StudyStats {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  todaySessions: number;
  weekSessions: number;
  monthSessions: number;
}

export const EMPTY_STATS: StudyStats = {
  todayMinutes: 0, weekMinutes: 0, monthMinutes: 0,
  todaySessions: 0, weekSessions: 0, monthSessions: 0,
};
