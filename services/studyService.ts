import { collection, query, where, getDocs, Timestamp, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface StudySession {
  uid: string;
  subject: string; // Used as display name or raw topic name
  subjectId?: string;
  topicId?: string;
  duration: number;
  startTime: Timestamp;
  endTime: Timestamp;
  note?: string;
}

export async function getRecentStudySessions(uid: string): Promise<StudySession[]> {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    date.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "users", uid, "studySessions"),
      where("startTime", ">=", Timestamp.fromDate(date))
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as StudySession);
  } catch (error) {
    console.error("Error fetching recent study sessions:", error);
    return [];
  }
}

export async function saveStudySession(
  uid: string,
  subject: string,
  durationSecs: number,
  subjectId?: string,
  topicId?: string,
  note?: string
) {
  const sessionData = {
    uid,
    subject,
    subjectId: subjectId || null,
    topicId: topicId || null,
    note: note || "",
    duration: durationSecs,
    startTime: Timestamp.fromMillis(Date.now() - durationSecs * 1000),
    endTime: Timestamp.now(),
  };
  
  await addDoc(collection(db, "users", uid, "studySessions"), sessionData);
  return sessionData;
}
