import {
  collection,
  doc,
  runTransaction,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  SubmitStudyTaskResult,
} from "@/types/studyTaskProgress";

import {
  calculateStudyTaskResult,
} from "./resultCalculator";

import {
  buildAttemptPayload,
  buildCalendarResultPayload,
  buildProgressPayload,
} from "./payloadBuilders";

export async function submitStudyTaskResult(
  input: SubmitStudyTaskResult
) {
  const progressRef = doc(
    db,
    "users",
    input.uid,
    "studyTaskProgress",
    input.taskId
  );

  const attemptRef = input.calendarEventId
    ? doc(
        db,
        "users",
        input.uid,
        "studyTaskAttempts",
        input.calendarEventId
      )
    : doc(
        collection(
          db,
          "users",
          input.uid,
          "studyTaskAttempts"
        )
      );

  const eventRef = input.calendarEventId
    ? doc(
        db,
        "users",
        input.uid,
        "calendarEvents",
        input.calendarEventId
      )
    : null;

  return runTransaction(db, async (transaction) => {
    const progressSnapshot =
      await transaction.get(progressRef);

    const eventSnapshot = eventRef
      ? await transaction.get(eventRef)
      : null;

    if (eventSnapshot && !eventSnapshot.exists()) {
      throw new Error("Takvim ödevi bulunamadı.");
    }

    if (
      eventSnapshot?.data().homeworkStatus ===
      "completed"
    ) {
      throw new Error(
        "Bu ödevin sonucu zaten girilmiş."
      );
    }

    const attemptCount =
      Number(
        progressSnapshot.data()?.attemptCount ?? 0
      ) + 1;

    const result = calculateStudyTaskResult({
      assignedQuestions: input.assignedQuestions,
      solvedQuestions: input.solvedQuestions,
      correct: input.correct,
      wrong: input.wrong,
    });

    const now = Timestamp.now();

    transaction.set(
      progressRef,
      buildProgressPayload(
        input,
        result,
        attemptCount,
        now
      ),
      { merge: true }
    );

    transaction.set(
      attemptRef,
      buildAttemptPayload(
        input,
        result,
        attemptCount,
        now
      )
    );

    if (eventRef) {
      transaction.update(
        eventRef,
        buildCalendarResultPayload(result, now)
      );
    }

    return result;
  });
}