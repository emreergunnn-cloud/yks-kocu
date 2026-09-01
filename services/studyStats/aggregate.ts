import type { StudySessionRecord, StudyStats } from "./types";
import { EMPTY_STATS } from "./types";
import { startOfDay, startOfMonth, startOfWeek, toDate } from "./dateUtils";

export function aggregateStudyStats(records: StudySessionRecord[]): StudyStats {
  const stats = { ...EMPTY_STATS };
  const dayStart = startOfDay();
  const weekStart = startOfWeek();
  const monthStart = startOfMonth();
  records.forEach((data) => {
    const minutes = (Number(data.duration) || 0) / 60;
    const sessionDate = toDate(data.startTime);
    if (sessionDate >= monthStart) { stats.monthMinutes += minutes; stats.monthSessions += 1; }
    if (sessionDate >= weekStart) { stats.weekMinutes += minutes; stats.weekSessions += 1; }
    if (sessionDate >= dayStart) { stats.todayMinutes += minutes; stats.todaySessions += 1; }
  });
  stats.todayMinutes = Math.round(stats.todayMinutes);
  stats.weekMinutes = Math.round(stats.weekMinutes);
  stats.monthMinutes = Math.round(stats.monthMinutes);
  return stats;
}
