import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface StudySessionRecord {
  id?: string;
  uid: string;
  subject: string;
  duration: number; // seconds
  note?: string;
  startTime: any;
  endTime: any;
}

export interface StudyStats {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  todaySessions: number;
  weekSessions: number;
  monthSessions: number;
}

function startOfDay(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(): Date {
  const d = new Date();
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - ((day + 6) % 7)); // Monday
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Compute study stats from Firestore studySessions sub-collection.
 */
export async function getStudyStats(uid: string): Promise<StudyStats> {
  const stats: StudyStats = {
    todayMinutes: 0,
    weekMinutes: 0,
    monthMinutes: 0,
    todaySessions: 0,
    weekSessions: 0,
    monthSessions: 0,
  };

  try {
    const monthStart = startOfMonth();
    const q = query(
      collection(db, "users", uid, "studySessions"),
      where("startTime", ">=", Timestamp.fromDate(monthStart))
    );
    const snap = await getDocs(q);

    const dayStart = startOfDay();
    const weekStart = startOfWeek();

    snap.docs.forEach((d) => {
      const data = d.data() as StudySessionRecord;
      const secs = data.duration || 0;
      const mins = secs / 60;

      let sessionDate: Date;
      if (data.startTime?.toDate) {
        sessionDate = data.startTime.toDate();
      } else if (data.startTime?.seconds) {
        sessionDate = new Date(data.startTime.seconds * 1000);
      } else {
        sessionDate = new Date(data.startTime);
      }

      stats.monthMinutes += mins;
      stats.monthSessions++;

      if (sessionDate >= weekStart) {
        stats.weekMinutes += mins;
        stats.weekSessions++;
      }
      if (sessionDate >= dayStart) {
        stats.todayMinutes += mins;
        stats.todaySessions++;
      }
    });

    // Round minutes
    stats.todayMinutes = Math.round(stats.todayMinutes);
    stats.weekMinutes = Math.round(stats.weekMinutes);
    stats.monthMinutes = Math.round(stats.monthMinutes);
  } catch {
    // return zeros on error
  }

  return stats;
}
