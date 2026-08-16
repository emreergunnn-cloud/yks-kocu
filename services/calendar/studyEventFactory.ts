import {
  Timestamp,
} from "firebase/firestore";

import type {
  StudyTask,
} from "@/types/studyPlan";

export function createStudyEvent(
  task: StudyTask,
  date: string
) {
  const isCarryover =
    task.assignmentKind ===
    "carryover";

  return {
    date,

    title:
      `${task.subject} - ${task.topic}`,

    type:
      "study",

    color:
      "bg-blue-500",

    notes:
      isCarryover
        ? `${task.questionCount} eksik soru tamamlama`
        : `${task.questionCount} soru hedefi`,

    durationMinutes:
      task.durationMinutes,

    subjectId:
      task.subjectId,

    topicId:
      task.topicId,

    studyTaskId:
      task.id,

    progressTaskId:
      task.progressTaskId ??
      task.id,

    assignmentKind:
      task.assignmentKind ??
      "regular",

    studyTaskType:
      task.type,

    questionCount:
      task.questionCount,

    carryoverQuestions:
      task.assignmentKind ===
      "carryover"
        ? task.questionCount
        : 0,

    previousAssignments:
      task.previousAssignments ??
      0,

    homeworkStatus:
      "assigned",

    ...(task.remediation
      ? {
          remediation:
            task.remediation,
        }
      : {}),

    source:
      "studyPlan",

    createdAt:
      Timestamp.now(),
  };
}