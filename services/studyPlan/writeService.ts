import {
  collection,
  deleteDoc,
  doc,
  runTransaction,
  Timestamp,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import {
  incrementAssignmentHistory,
} from "./assignmentHistoryService";

export async function saveStudyPlan(
  uid: string,
  mode: "daily" | "weekly",
  date: string,
  taskIds: string[]
) {
  const planRef = doc(
    collection(
      db,
      "users",
      uid,
      "studyPlans"
    )
  );

  const data = {
    uid,
    mode,
    date,
    taskIds,
    createdAt:
      Timestamp.now(),
  };

  await runTransaction(
    db,
    async (transaction) => {
      await incrementAssignmentHistory(
        transaction,
        uid,
        taskIds
      );

      transaction.set(
        planRef,
        data
      );
    }
  );

  return {
    id: planRef.id,
    ...data,
  };
}

export async function deleteStudyPlan(
  uid: string,
  planId: string
): Promise<void> {
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