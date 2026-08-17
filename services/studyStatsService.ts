import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import {
  db,
} from "../lib/firebase";

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

const EMPTY_STATS: StudyStats = {
  todayMinutes: 0,
  weekMinutes: 0,
  monthMinutes: 0,

  todaySessions: 0,
  weekSessions: 0,
  monthSessions: 0,
};

function startOfDay() {
  const date =
    new Date();

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
}

function startOfWeek() {
  const date =
    new Date();

  const day =
    date.getDay();

  date.setDate(
    date.getDate() -
      ((day + 6) % 7)
  );

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
}

function startOfMonth() {
  const date =
    new Date();

  date.setDate(1);

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
}

function toDate(
  value: unknown
): Date {
  if (
    value &&
    typeof value ===
      "object"
  ) {
    const timestamp =
      value as {
        toDate?: () => Date;
        seconds?: number;
      };

    if (
      timestamp.toDate
    ) {
      return timestamp.toDate();
    }

    if (
      typeof timestamp.seconds ===
      "number"
    ) {
      return new Date(
        timestamp.seconds * 1000
      );
    }
  }

  if (
    value instanceof Date
  ) {
    return value;
  }

  if (
    typeof value ===
      "string" ||
    typeof value ===
      "number"
  ) {
    return new Date(value);
  }

  return new Date(0);
}

export async function getStudyStats(
  uid: string
): Promise<StudyStats> {
  const stats: StudyStats = {
    ...EMPTY_STATS,
  };

  try {
    const dayStart =
      startOfDay();

    const weekStart =
      startOfWeek();

    const monthStart =
      startOfMonth();

    const queryStart =
      new Date(
        Math.min(
          dayStart.getTime(),
          weekStart.getTime(),
          monthStart.getTime()
        )
      );

    const q = query(
      collection(
        db,
        "users",
        uid,
        "studySessions"
      ),
      where(
        "startTime",
        ">=",
        Timestamp.fromDate(
          queryStart
        )
      )
    );

    const snapshot =
      await getDocs(q);

    snapshot.docs.forEach(
      (item) => {
        const data =
          item.data() as StudySessionRecord;

        const seconds =
          Number(
            data.duration
          ) || 0;

        const minutes =
          seconds / 60;

        const sessionDate =
          toDate(
            data.startTime
          );

        if (
          sessionDate >=
          monthStart
        ) {
          stats.monthMinutes +=
            minutes;

          stats.monthSessions++;
        }

        if (
          sessionDate >=
          weekStart
        ) {
          stats.weekMinutes +=
            minutes;

          stats.weekSessions++;
        }

        if (
          sessionDate >=
          dayStart
        ) {
          stats.todayMinutes +=
            minutes;

          stats.todaySessions++;
        }
      }
    );

    stats.todayMinutes =
      Math.round(
        stats.todayMinutes
      );

    stats.weekMinutes =
      Math.round(
        stats.weekMinutes
      );

    stats.monthMinutes =
      Math.round(
        stats.monthMinutes
      );
  } catch (error) {
    console.error(
      "Çalışma istatistikleri alınamadı:",
      error
    );
  }

  return stats;
}
