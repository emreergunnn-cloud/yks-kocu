import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Timestamp,
  type Transaction,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

function createStudyPlanData(
  uid: string,
  mode: "daily" | "weekly",
  date: string,
  taskIds: string[]
) {
  return {
    uid,
    mode,
    date,
    taskIds,

    createdAt:
      Timestamp.now(),
  };
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

  const data =
    createStudyPlanData(
      uid,
      mode,
      date,
      taskIds
    );

  const result =
    await addDoc(
      ref,
      data
    );

  return {
    id: result.id,
    ...data,
  };
}

export function writeStudyPlanInTransaction(
  transaction:
    Transaction,

  uid: string,

  mode:
    "daily" | "weekly",

  date: string,

  taskIds:
    string[]
) {
  const ref = doc(
    collection(
      db,
      "users",
      uid,
      "studyPlans"
    )
  );

  const data =
    createStudyPlanData(
      uid,
      mode,
      date,
      taskIds
    );

  transaction.set(
    ref,
    data
  );

  return {
    id: ref.id,
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
