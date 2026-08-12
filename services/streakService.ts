import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  weeklyStreak: number;
  monthlyStreak: number;
  totalStudyDays: number;
  lastStudyWeek?: string | null;
  lastStudyMonth?: string | null;
  updatedAt?: Timestamp;
}

const EMPTY_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  weeklyStreak: 0,
  monthlyStreak: 0,
  totalStudyDays: 0,
  lastStudyWeek: null,
  lastStudyMonth: null,
};

function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db_ = new Date(b).getTime();
  return Math.round(Math.abs(da - db_) / 86_400_000);
}

function isoWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function isConsecutiveWeek(lastWeekKey: string, currentDate: Date): boolean {
  const d = new Date(currentDate);
  d.setDate(d.getDate() - 7);
  return isoWeekKey(toYMD(d)) === lastWeekKey;
}

function isConsecutiveMonth(lastMonthKey: string, currentDate: Date): boolean {
  const d = new Date(currentDate);
  d.setDate(0);
  return monthKey(toYMD(d)) === lastMonthKey;
}

export async function getStreakData(uid: string): Promise<StreakData> {
  try {
    const ref = doc(db, "users", uid, "stats", "streak");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as StreakData;
    }
    return { ...EMPTY_STREAK };
  } catch {
    return { ...EMPTY_STREAK };
  }
}

export async function recordStudyActivity(uid: string, endTime?: Date | number): Promise<StreakData> {
  const activityDate = endTime ? new Date(endTime) : new Date();
  const today = toYMD(activityDate);
  const currentWeekKey = isoWeekKey(today);
  const currentMonthKey = monthKey(today);

  try {
    const ref = doc(db, "users", uid, "stats", "streak");
    const snap = await getDoc(ref);
    const existing: StreakData = snap.exists()
      ? (snap.data() as StreakData)
      : { ...EMPTY_STREAK };

    if (existing.lastStudyDate === today) {
      return existing;
    }

    let newCurrent = 1;
    if (existing.lastStudyDate) {
      const diff = daysBetween(existing.lastStudyDate, today);
      if (diff === 1) {
        newCurrent = existing.currentStreak + 1;
      } else {
        newCurrent = 1;
      }
    }

    let newLastStudyWeek = existing.lastStudyWeek;
    if (!newLastStudyWeek && existing.lastStudyDate) {
      newLastStudyWeek = isoWeekKey(existing.lastStudyDate);
    }

    let newWeeklyStreak = existing.weeklyStreak || 0;
    if (newLastStudyWeek === currentWeekKey) {
      // same week, no change
    } else if (newLastStudyWeek && isConsecutiveWeek(newLastStudyWeek, activityDate)) {
      newWeeklyStreak++;
    } else {
      newWeeklyStreak = 1;
    }

    let newLastStudyMonth = existing.lastStudyMonth;
    if (!newLastStudyMonth && existing.lastStudyDate) {
      newLastStudyMonth = monthKey(existing.lastStudyDate);
    }

    let newMonthlyStreak = existing.monthlyStreak || 0;
    if (newLastStudyMonth === currentMonthKey) {
      // same month, no change
    } else if (newLastStudyMonth && isConsecutiveMonth(newLastStudyMonth, activityDate)) {
      newMonthlyStreak++;
    } else {
      newMonthlyStreak = 1;
    }

    const updated: StreakData = {
      currentStreak: newCurrent,
      longestStreak: Math.max(existing.longestStreak, newCurrent),
      lastStudyDate: today,
      weeklyStreak: newWeeklyStreak,
      monthlyStreak: newMonthlyStreak,
      totalStudyDays: (existing.totalStudyDays || 0) + 1,
      lastStudyWeek: currentWeekKey,
      lastStudyMonth: currentMonthKey,
      updatedAt: Timestamp.now(),
    };

    await setDoc(ref, updated);
    return updated;
  } catch {
    return { ...EMPTY_STREAK };
  }
}
