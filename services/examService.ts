import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { ExamResult, SectionScore } from "../types/exam";

/**
 * Calculates net score: Net = Correct - (Wrong / 4)
 */
export function calculateNet(dogru: number, yanlis: number): number {
  const d = Math.max(0, Number(dogru) || 0);
  const y = Math.max(0, Number(yanlis) || 0);
  const rawNet = d - y / 4;
  return Number(rawNet.toFixed(2));
}

/**
 * Helper to build a complete SectionScore object
 */
export function buildSectionScore(dogru: number, yanlis: number, totalQuestions: number): SectionScore {
  const d = Math.max(0, Number(dogru) || 0);
  const y = Math.max(0, Number(yanlis) || 0);
  const bos = Math.max(0, totalQuestions - (d + y));
  const net = calculateNet(d, y);
  return { dogru: d, yanlis: y, bos, net };
}

/**
 * Fetch all exam results for a user sorted by timestamp descending
 */
export async function getExamResults(uid: string, limit?: number): Promise<ExamResult[]> {
  try {
    const q = query(
      collection(db, "exam_results"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    const results: ExamResult[] = [];
    snap.forEach((document) => {
      results.push({
        id: document.id,
        ...(document.data() as ExamResult),
      });
    });
    return limit ? results.slice(0, limit) : results;
  } catch (error) {
    console.error("getExamResults error:", error);
    // Fallback un-indexed fetch if compound index is building
    try {
      const fallbackQuery = query(
        collection(db, "exam_results"),
        where("uid", "==", uid)
      );
      const snap = await getDocs(fallbackQuery);
      const results: ExamResult[] = [];
      snap.forEach((document) => {
        results.push({
          id: document.id,
          ...(document.data() as ExamResult),
        });
      });
      const sorted = results.sort((a, b) => {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA;
      });
      return limit ? sorted.slice(0, limit) : sorted;
    } catch (fallbackError) {
      console.error("Fallback getExamResults error:", fallbackError);
      return [];
    }
  }
}

/**
 * Fetch single exam result by ID
 */
export async function getExamById(id: string): Promise<ExamResult | null> {
  try {
    const ref = doc(db, "exam_results", id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as ExamResult) };
    }
    return null;
  } catch (error) {
    console.error("getExamById error:", error);
    return null;
  }
}

/**
 * Create a new practice exam result entry
 */
export async function createExamResult(exam: Omit<ExamResult, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "exam_results"), {
      ...exam,
      createdAt: exam.createdAt || Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("createExamResult error:", error);
    throw error;
  }
}

/**
 * Update an existing practice exam result entry
 */
export async function updateExamResult(id: string, exam: Partial<ExamResult>): Promise<void> {
  try {
    const ref = doc(db, "exam_results", id);
    await updateDoc(ref, {
      ...exam,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("updateExamResult error:", error);
    throw error;
  }
}

/**
 * Delete a practice exam result entry
 */
export async function deleteExamResult(id: string): Promise<void> {
  try {
    const ref = doc(db, "exam_results", id);
    await deleteDoc(ref);
  } catch (error) {
    console.error("deleteExamResult error:", error);
    throw error;
  }
}
