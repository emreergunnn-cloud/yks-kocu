import type {
  CalendarEvent,
} from "@/services/calendar";

import type {
  StudyTaskResultSummary,
} from "@/types/studyTaskProgress";

export function getCalendarEventResult(
  event: CalendarEvent
): StudyTaskResultSummary {
  return {
    assignedQuestions:
      event.questionCount ?? 0,

    solvedQuestions:
      event.solvedQuestions ?? 0,

    correct:
      event.correctQuestions ?? 0,

    wrong:
      event.wrongQuestions ?? 0,

    blank:
      event.blankQuestions ?? 0,

    remainingQuestions:
      event.remainingQuestions ?? 0,

    accuracy:
      event.accuracy ?? 0,
  };
}