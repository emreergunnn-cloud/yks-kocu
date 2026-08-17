import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as queryLimit,
  orderBy,
  query,
  runTransaction,
  Timestamp,
  where,
  type QueryConstraint,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import type { ExamResult, SectionScore } from "../types/exam";

export function calculateNet(dogru: number, yanlis: number): number {
  const d = Math.max(0, Number(dogru) || 0);
  const y = Math.max(0, Number(yanlis) || 0);
  return Number((d - y / 4).toFixed(2));
}

export function buildSectionScore(
  dogru: number,
  yanlis: number,
  totalQuestions: number
): SectionScore {
  const d = Math.max(0, Number(dogru) || 0);
  const y = Math.max(0, Number(yanlis) || 0);

  return {
    dogru: d,
    yanlis: y,
    bos: Math.max(0, totalQuestions - d - y),
    net: calculateNet(d, y),
  };
}

function mapExam(document: { id: string; data: () => unknown }): ExamResult {
  return {
    id: document.id,
    ...(document.data() as ExamResult),
  };
}

export async function getExamResults(
  uid: string,
  maxResults?: number
): Promise<ExamResult[]> {
  try {
    const constraints: QueryConstraint[] = [
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
    ];

    if (maxResults) constraints.push(queryLimit(maxResults));

    const snapshot = await getDocs(
      query(collection(db, "exam_results"), ...constraints)
    );

    return snapshot.docs.map(mapExam);
  } catch (error) {
    console.error("getExamResults error:", error);

    try {
      const snapshot = await getDocs(
        query(collection(db, "exam_results"), where("uid", "==", uid))
      );

      const results = snapshot.docs
        .map(mapExam)
        .sort(
          (a, b) =>
            Number(b.createdAt?.seconds ?? 0) -
            Number(a.createdAt?.seconds ?? 0)
        );

      return maxResults ? results.slice(0, maxResults) : results;
    } catch (fallbackError) {
      console.error("Fallback getExamResults error:", fallbackError);
      return [];
    }
  }
}

export async function getExamById(
  id: string,
  uid: string
): Promise<ExamResult | null> {
  try {
    const snapshot = await getDoc(doc(db, "exam_results", id));
    if (!snapshot.exists()) return null;

    const exam = mapExam(snapshot);
    return exam.uid === uid ? exam : null;
  } catch (error) {
    console.error("getExamById error:", error);
    return null;
  }
}

export async function createExamResult(
  exam: Omit<ExamResult, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, "exam_results"), {
    ...exam,
    createdAt: exam.createdAt || Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return ref.id;
}

export async function updateExamResult(
  id: string,
  uid: string,
  exam: Omit<ExamResult, "id">
): Promise<void> {
  const ref = doc(db, "exam_results", id);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists() || snapshot.data().uid !== uid) {
      throw new Error("Deneme bulunamadı veya erişim izniniz yok.");
    }

    transaction.set(ref, {
      ...exam,
      uid,
      createdAt: exam.createdAt ?? snapshot.data().createdAt ?? Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  });
}

export async function deleteExamResult(
  id: string,
  uid: string
): Promise<void> {
  const ref = doc(db, "exam_results", id);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists() || snapshot.data().uid !== uid) {
      throw new Error("Deneme bulunamadı veya erişim izniniz yok.");
    }

    transaction.delete(ref);
  });
}
