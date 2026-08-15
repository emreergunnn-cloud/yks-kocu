import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface SavedStudyPlan {
  id: string;
  uid: string;
  mode: "daily" | "weekly";
  date: string;
  taskIds: string[];
  createdAt?: Timestamp;
}

export async function saveStudyPlan(
  uid: string,
  mode: "daily" | "weekly",
  date: string,
  taskIds: string[]
) {
  const ref = collection(
    db,
    "users",
    uid,
    "studyPlans"
  );

  const data = {
    uid,
    mode,
    date,
    taskIds,
    createdAt: Timestamp.now(),
  };

  const result = await addDoc(ref, data);

  return {
    id: result.id,
    ...data,
  };
}

export async function getStudyPlans(
  uid: string
): Promise<SavedStudyPlan[]> {
  const ref = collection(
    db,
    "users",
    uid,
    "studyPlans"
  );

  const snapshot = await getDocs(ref);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<SavedStudyPlan, "id">),
  }));
}

export async function deleteStudyPlan(
  uid: string,
  planId: string
) {
  await deleteDoc(
    doc(
      db,
      "users",
      uid,
      "studyPlans",
      planId
    )
  );
}