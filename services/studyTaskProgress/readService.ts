import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import type {
  StudyTaskProgress,
  StudyTaskProgressMap,
} from "@/types/studyTaskProgress";

export async function getStudyTaskProgress(
  uid: string
): Promise<StudyTaskProgressMap> {
  const ref = collection(
    db,
    "users",
    uid,
    "studyTaskProgress"
  );

  const snapshot =
    await getDocs(ref);

  const result:
    StudyTaskProgressMap = {};

  snapshot.docs.forEach(
    (item) => {
      const data =
        item.data();

      const progress:
        StudyTaskProgress = {
        taskId: item.id,

        subjectId:
          String(
            data.subjectId ?? ""
          ),

        topicId:
          String(
            data.topicId ?? ""
          ),

        attemptCount:
          Number(
            data.attemptCount ?? 0
          ),

        lastAssignedQuestions:
          Number(
            data.lastAssignedQuestions ?? 0
          ),

        lastSolvedQuestions:
          Number(
            data.lastSolvedQuestions ?? 0
          ),

        lastCorrect:
          Number(
            data.lastCorrect ?? 0
          ),

        lastWrong:
          Number(
            data.lastWrong ?? 0
          ),

        lastBlank:
          Number(
            data.lastBlank ?? 0
          ),

        remainingQuestions:
          Number(
            data.remainingQuestions ?? 0
          ),

        accuracy:
          Number(
            data.accuracy ?? 0
          ),
      };

      result[item.id] =
        progress;
    }
  );

  return result;
}