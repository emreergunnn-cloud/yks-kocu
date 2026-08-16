import type {
  StudyTask,
} from "@/types/studyPlan";

import {
  evaluateRemediation,
} from "../remediation/performanceEvaluator";

import {
  getCandidatePriority,
} from "./candidatePriority";

import {
  getCandidateLoad,
} from "./candidateLoad";

import type {
  CandidateBuildOptions,
} from "./types";

export function buildStudyCandidate({
  subjectId,
  subjectName,
  category,
  topicId,
  topicName,
  topicIndex,
  subjectProgressPct,
  progressMap,
  alan,
  taskProgress,
}: CandidateBuildOptions):
  StudyTask | null {
  const status =
    progressMap[
      subjectId
    ]?.[topicId];

  const priorityResult =
    getCandidatePriority({
      status,
      topicIndex,
      subjectProgressPct,
      subjectId,
      topicId,
      alan,
    });

  if (!priorityResult) {
    return null;
  }

  const taskId =
    `${subjectId}-${topicId}`;

  const history =
    taskProgress[
      taskId
    ];

  const previousAssignments =
    history?.attemptCount ??
    0;

  const load =
    getCandidateLoad({
      topicName,

      taskType:
        priorityResult.type,

      priority:
        priorityResult.priority,

      previousAssignments,

      carryoverQuestions:
        0,

      examImpact:
        priorityResult.examImpact,
    });

  return {
    id: taskId,

    progressTaskId:
      taskId,

    assignmentKind:
      "regular",

    subjectId,

    subject:
      subjectName,

    topicId,

    topic:
      topicName,

    category,

    durationMinutes:
      load.durationMinutes,

    questionCount:
      load.questionCount,

    type:
      priorityResult.type,

    priority:
      load.priority,

    examImpact:
      priorityResult.examImpact,

    role:
      load.role,

    previousAssignments,

    carryoverQuestions:
      0,

    remediation:
      evaluateRemediation(
        history
      ),
  };
}