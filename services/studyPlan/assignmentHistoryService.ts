import {
  doc,
  getDoc,
  Timestamp,
  type Transaction,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import type {
  StudyAssignmentCounts,
} from "@/types/studyPlan";

import type {
  AssignmentHistory,
} from "./types";

function getHistoryRef(
  uid: string
) {
  return doc(
    db,
    "users",
    uid,
    "studyMeta",
    "reinforcement"
  );
}

export async function getStudyPlanAssignmentCounts(
  uid: string
): Promise<StudyAssignmentCounts> {
  const snapshot =
    await getDoc(
      getHistoryRef(uid)
    );

  if (!snapshot.exists()) {
    return {};
  }

  const data =
    snapshot.data() as AssignmentHistory;

  return data.counts ?? {};
}

export async function incrementAssignmentHistory(
  transaction: Transaction,
  uid: string,
  taskIds: string[]
): Promise<void> {
  const ref =
    getHistoryRef(uid);

  const snapshot =
    await transaction.get(ref);

  let previous:
    StudyAssignmentCounts = {};

  if (snapshot.exists()) {
    const data =
      snapshot.data() as AssignmentHistory;

    previous =
      data.counts ?? {};
  }

  const counts:
    StudyAssignmentCounts = {
      ...previous,
    };

  for (
    const taskId
    of taskIds
  ) {
    counts[taskId] =
      (counts[taskId] ?? 0) + 1;
  }

  transaction.set(
    ref,
    {
      counts,
      updatedAt:
        Timestamp.now(),
    }
  );
}