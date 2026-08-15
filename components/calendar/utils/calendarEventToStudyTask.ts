import {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

import type {
  CalendarEvent,
} from "@/services/calendar";

import type {
  StudyTask,
} from "@/types/studyPlan";

export function calendarEventToStudyTask(
  event: CalendarEvent
): StudyTask | null {
  if (
    event.type !== "study" ||
    !event.subjectId ||
    !event.topicId
  ) {
    return null;
  }

  const subject =
    YKS_SUBJECTS.find(
      (item) =>
        item.id ===
        event.subjectId
    );

  if (!subject) {
    return null;
  }

  const topic =
    subject.topics.find(
      (item) =>
        item.id ===
        event.topicId
    );

  if (!topic) {
    return null;
  }

  return {
    id: `calendar-${event.id}`,

    subjectId:
      subject.id,

    subject:
      subject.name,

    topicId:
      topic.id,

    topic:
      topic.name,

    category:
      subject.category,

    durationMinutes:
      event.durationMinutes ?? 0,

    questionCount: 0,

    type:
      event.studyTaskType ??
      "new",

    priority: 0,
  };
}