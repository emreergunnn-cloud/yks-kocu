import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { TopicStatus } from "../types/topic";

export type SubjectProgressMap = Record<string, Record<string, TopicStatus>>;

export async function getTopicProgress(uid: string): Promise<SubjectProgressMap> {
  try {
    const ref = doc(db, "users", uid, "topicProgress", "data");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as SubjectProgressMap;
    }
    return {};
  } catch {
    return {};
  }
}

export async function saveTopicStatus(
  uid: string,
  subjectId: string,
  topicId: string,
  status: TopicStatus
): Promise<void> {
  const ref = doc(db, "users", uid, "topicProgress", "data");
  const snap = await getDoc(ref);
  const existing: SubjectProgressMap = snap.exists()
    ? (snap.data() as SubjectProgressMap)
    : {};

  if (!existing[subjectId]) existing[subjectId] = {};
  existing[subjectId][topicId] = status;

  await setDoc(ref, existing, { merge: false });
}

export function computeSubjectStats(
  subjectId: string,
  topicIds: string[],
  progressMap: SubjectProgressMap
) {
  const subjectData = progressMap[subjectId] || {};
  let completed = 0;
  let studying = 0;
  let needsReview = 0;

  for (const tid of topicIds) {
    const s = subjectData[tid];
    if (s === "Tamamlandı") completed++;
    else if (s === "Çalışılıyor") studying++;
    else if (s === "Tekrar Edilecek") needsReview++;
  }

  const total = topicIds.length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, studying, needsReview, notStarted: total - completed - studying - needsReview, total, progressPct };
}
