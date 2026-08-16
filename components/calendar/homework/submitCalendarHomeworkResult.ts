import type {
  CalendarEvent,
} from "@/services/calendar";

import {
  submitStudyTaskResult,
} from "@/services/studyTaskProgressService";

import {
  validateHomeworkResult,
} from "@/lib/study/results/validateHomeworkResult";

interface Values {
  solved: number;
  correct: number;
  wrong: number;
}

interface Options {
  uid: string;

  event:
    CalendarEvent;

  values:
    Values;
}

export async function submitCalendarHomeworkResult({
  uid,
  event,
  values,
}: Options) {
  const progressTaskId =
    event.progressTaskId ??
    event.studyTaskId;

  if (
    !progressTaskId ||
    !event.subjectId ||
    !event.topicId ||
    !event.questionCount
  ) {
    throw new Error(
      "Bu ödevin çalışma bilgileri eksik."
    );
  }

  const validationError =
    validateHomeworkResult({
      assigned:
        event.questionCount,

      solved:
        values.solved,

      correct:
        values.correct,

      wrong:
        values.wrong,
    });

  if (validationError) {
    throw new Error(
      validationError
    );
  }

  return submitStudyTaskResult({
    uid,

    calendarEventId:
      event.id,

    taskId:
      progressTaskId,

    subjectId:
      event.subjectId,

    topicId:
      event.topicId,

    assignedQuestions:
      event.questionCount,

    solvedQuestions:
      values.solved,

    correct:
      values.correct,

    wrong:
      values.wrong,
  });
}