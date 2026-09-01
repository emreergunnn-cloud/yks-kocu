import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { aggregateStudyStats } from "./studyStats/aggregate";
import { startOfDay, startOfMonth, startOfWeek } from "./studyStats/dateUtils";
import { EMPTY_STATS, type StudySessionRecord, type StudyStats } from "./studyStats/types";

export type { StudySessionRecord, StudyStats } from "./studyStats/types";

export async function getStudyStats(uid: string): Promise<StudyStats> {
  try {
    const queryStart = new Date(Math.min(startOfDay().getTime(), startOfWeek().getTime(), startOfMonth().getTime()));
    const q = query(
      collection(db, "users", uid, "studySessions"),
      where("startTime", ">=", Timestamp.fromDate(queryStart))
    );
    const snapshot = await getDocs(q);
    return aggregateStudyStats(snapshot.docs.map((item) => item.data() as StudySessionRecord));
  } catch (error) {
    console.error("Çalışma istatistikleri alınamadı:", error);
    return { ...EMPTY_STATS };
  }
}
