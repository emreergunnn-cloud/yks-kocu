import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface StreakData {
  currentStreak: number;    // consecutive days studied
  longestStreak: number;
  lastStudyDate: string | null; // YYYY-MM-DD
  weeklyStreak: number;    // consecutive full weeks (Mon–Sun) with ≥1 study day
  monthlyStreak: number;   // consecutive calendar months with ≥1 study day
  totalStudyDays: number;
  updatedAt?: Timestamp;
}

const EMPTY_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  weeklyStreak: 0,
  monthlyStreak: 0,
  totalStudyDays: 0,
};

/** Convert a Date to YYYY-MM-DD string in local time */
function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Absolute difference in days between two YYYY-MM-DD strings */
function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db_ = new Date(b).getTime();
  return Math.round(Math.abs(da - db_) / 86_400_000);
}

/**
 * Returns the ISO week number (Mon=1 … Sun=7) and year for a given date.
 * Uses the ISO 8601 definition: week 1 contains the first Thursday.
 */
function isoWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getUTCDay() || 7; // Mon=1 … Sun=7
  d.setUTCDate(d.getUTCDate() + 4 - day); // nearest Thursday
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** Returns YYYY-MM key for a date string */
function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

/**
 * Compute weeklyStreak: number of consecutive full ISO weeks (ending last Sunday)
 * that each contain at least one study day. Counts backwards from the current week.
 */
function computeWeeklyStreak(studyDates: string[]): number {
  if (studyDates.length === 0) return 0;

  const weekSet = new Set(studyDates.map(isoWeekKey));
  const today = new Date();
  let streak = 0;
  let cursor = new Date(today);

  // Walk backwards week by week
  for (let i = 0; i < 104; i++) { // max 2 years
    const key = isoWeekKey(toYMD(cursor));
    if (weekSet.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 7);
    } else {
      // Allow skipping the current incomplete week once
      if (i === 0) {
        cursor.setDate(cursor.getDate() - 7);
        continue;
      }
      break;
    }
  }
  return streak;
}

/**
 * Compute monthlyStreak: number of consecutive calendar months (going back from
 * the current month) that each contain at least one study day.
 */
function computeMonthlyStreak(studyDates: string[]): number {
  if (studyDates.length === 0) return 0;

  const monthSet = new Set(studyDates.map(monthKey));
  const today = new Date();
  let streak = 0;
  let year = today.getFullYear();
  let month = today.getMonth() + 1; // 1-based

  for (let i = 0; i < 48; i++) { // max 4 years
    const key = `${year}-${String(month).padStart(2, "0")}`;
    if (monthSet.has(key)) {
      streak++;
    } else {
      // Allow skipping the current month once (it may not be over yet)
      if (i === 0) {
        // fall through — don't break on the first iteration
      } else {
        break;
      }
    }
    // Go one month back
    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
  }
  return streak;
}

/**
 * Load all historical study-day keys from the user's `studySessions` subcollection.
 * Returns an array of YYYY-MM-DD strings (may contain duplicates — caller dedupes).
 */
async function loadStudyDates(uid: string): Promise<string[]> {
  try {
    const sessionsRef = collection(db, "users", uid, "studySessions");
    const q = query(sessionsRef, orderBy("startTime", "asc"));
    const snap = await getDocs(q);
    const dates: string[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.startTime) {
        let d: Date;
        if (data.startTime instanceof Timestamp) {
          d = data.startTime.toDate();
        } else {
          d = new Date(data.startTime);
        }
        dates.push(toYMD(d));
      }
    });
    return dates;
  } catch {
    return [];
  }
}

/** Get the current streak data for a user. */
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

/**
 * Record a study activity for today, updating streak data.
 * Call once per study session or when a user marks a topic as completed.
 * Recomputes weekly/monthly streaks using full session history.
 */
export async function recordStudyActivity(uid: string): Promise<StreakData> {
  const today = toYMD(new Date());

  try {
    const ref = doc(db, "users", uid, "stats", "streak");
    const snap = await getDoc(ref);
    const existing: StreakData = snap.exists()
      ? (snap.data() as StreakData)
      : { ...EMPTY_STREAK };

    // Already recorded today — return existing without re-computing
    if (existing.lastStudyDate === today) {
      return existing;
    }

    // Compute daily streak
    let newCurrent = 1;
    if (existing.lastStudyDate) {
      const diff = daysBetween(existing.lastStudyDate, today);
      if (diff === 1) {
        newCurrent = existing.currentStreak + 1;
      } else {
        newCurrent = 1; // streak broken
      }
    }

    // Load full history for accurate weekly/monthly computation
    const allDates = await loadStudyDates(uid);
    // Include today (in case the session write happens later)
    if (!allDates.includes(today)) allDates.push(today);

    const weeklyStreak = computeWeeklyStreak(allDates);
    const monthlyStreak = computeMonthlyStreak(allDates);

    const updated: StreakData = {
      currentStreak: newCurrent,
      longestStreak: Math.max(existing.longestStreak, newCurrent),
      lastStudyDate: today,
      weeklyStreak,
      monthlyStreak,
      totalStudyDays: existing.totalStudyDays + 1,
      updatedAt: Timestamp.now(),
    };

    await setDoc(ref, updated);
    return updated;
  } catch {
    return { ...EMPTY_STREAK };
  }
}

/**
 * Force a full recomputation of weekly/monthly streaks from session history.
 * Useful after bulk data imports or corrections.
 */
export async function recomputeStreaks(uid: string): Promise<StreakData> {
  try {
    const ref = doc(db, "users", uid, "stats", "streak");
    const snap = await getDoc(ref);
    const existing: StreakData = snap.exists()
      ? (snap.data() as StreakData)
      : { ...EMPTY_STREAK };

    const allDates = await loadStudyDates(uid);
    const weeklyStreak = computeWeeklyStreak(allDates);
    const monthlyStreak = computeMonthlyStreak(allDates);

    const updated: StreakData = {
      ...existing,
      weeklyStreak,
      monthlyStreak,
      updatedAt: Timestamp.now(),
    };

    await setDoc(ref, updated);
    return updated;
  } catch {
    return { ...EMPTY_STREAK };
  }
}
