import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import {
  db,
} from "../lib/firebase";

export interface StudySession {
  uid: string;
  subject: string;

  subjectId?: string | null;
  topicId?: string | null;

  duration: number;

  startTime: Timestamp;
  endTime: Timestamp;

  note?: string;
}

export async function getRecentStudySessions(
  uid: string
): Promise<StudySession[]> {
  try {
    const date = new Date();

    date.setDate(
      date.getDate() - 30
    );

    date.setHours(
      0,
      0,
      0,
      0
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
        Timestamp.fromDate(date)
      )
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs
      .map(
        (item) =>
          item.data() as StudySession
      )
      .sort(
        (a, b) =>
          b.endTime.toMillis() -
          a.endTime.toMillis()
      );
  } catch (error) {
    console.error(
      "Çalışma seansları alınamadı:",
      error
    );

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

    subject:
      subject || "Genel",

    subjectId:
      subjectId || null,

    topicId:
      topicId || null,

    note:
      note || "",

    duration:
      durationSecs,

    startTime:
      Timestamp.fromMillis(
        Date.now() -
          durationSecs * 1000
      ),

    endTime:
      Timestamp.now(),
  };

  await addDoc(
    collection(
      db,
      "users",
      uid,
      "studySessions"
    ),
    sessionData
  );

  return sessionData;
}
