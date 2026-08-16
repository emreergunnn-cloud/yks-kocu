import type {
  Timestamp,
} from "firebase/firestore";

import type {
  StudyTaskResultSummary,
  SubmitStudyTaskResult,
} from "@/types/studyTaskProgress";

export function buildProgressPayload(
  input: SubmitStudyTaskResult,
  result: StudyTaskResultSummary,
  attemptCount: number,
  now: Timestamp
) {
  return {
    taskId: input.taskId,
    subjectId: input.subjectId,
    topicId: input.topicId,
    attemptCount,

    lastAssignedQuestions:
      result.assignedQuestions,
    lastSolvedQuestions:
      result.solvedQuestions,
    lastCorrect: result.correct,
    lastWrong: result.wrong,
    lastBlank: result.blank,

    remainingQuestions:
      result.remainingQuestions,
    accuracy: result.accuracy,
    updatedAt: now,
  };
}

export function buildAttemptPayload(
  input: SubmitStudyTaskResult,
  result: StudyTaskResultSummary,
  attemptCount: number,
  now: Timestamp
) {
  return {
    taskId: input.taskId,
    subjectId: input.subjectId,
    topicId: input.topicId,

    ...result,

    attemptNumber: attemptCount,

    ...(input.calendarEventId
      ? { calendarEventId: input.calendarEventId }
      : {}),

    createdAt: now,
  };
}

export function buildCalendarResultPayload(
  result: StudyTaskResultSummary,
  now: Timestamp
) {
  return {
    homeworkStatus: "completed",

    solvedQuestions:
      result.solvedQuestions,
    correctQuestions:
      result.correct,
    wrongQuestions:
      result.wrong,
    blankQuestions:
      result.blank,

    remainingQuestions:
      result.remainingQuestions,
    accuracy:
      result.accuracy,

    resultSubmittedAt: now,
  };
}