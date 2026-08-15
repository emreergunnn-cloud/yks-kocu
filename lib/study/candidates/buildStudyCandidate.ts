import type {
  SubjectProgressMap,
} from "@/services/topicService";

import type {
  AlanOption,
} from "@/types/user";

import type {
  StudyAssignmentCounts,
  StudyCategory,
  StudyTask,
} from "@/types/studyPlan";

import {
  getTopicDuration,
} from "../topicDifficulty";

import {
  getQuestionCount,
} from "../questionCalculator";

import {
  getNewTopicPriority,
  resolveTaskType,
} from "../studyRules";

import {
  buildExamImpact,
} from "../priority/examImpactCalculator";

import {
  getExamPriorityBoost,
} from "../priority/examPriorityBoost";

import {
  resolveReinforcementLoad,
} from "../reinforcement/reinforcementLoad";

interface Options {
  subjectId: string;
  subjectName: string;

  category:
    StudyCategory;

  topicId: string;
  topicName: string;

  topicIndex: number;

  subjectProgressPct: number;

  progressMap:
    SubjectProgressMap;

  alan:
    AlanOption | "";

  assignmentCounts:
    StudyAssignmentCounts;
}

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
  assignmentCounts,
}: Options): StudyTask | null {
  const status =
    progressMap[
      subjectId
    ]?.[topicId];

  const resolved =
    resolveTaskType(status);

  if (!resolved) {
    return null;
  }

  const taskId =
    `${subjectId}-${topicId}`;

  const previousAssignments =
    assignmentCounts[
      taskId
    ] ?? 0;

  const initialPriority =
    resolved.type === "new"
      ? getNewTopicPriority(
          topicIndex,
          subjectProgressPct
        )
      : resolved.priority;

  const examImpact =
    buildExamImpact({
      subjectId,
      topicId,
      alan,
      taskType:
        resolved.type,
    });

  const priorityWithImpact =
    initialPriority +
    getExamPriorityBoost(
      examImpact,
      resolved.type
    );

  const baseDuration =
    getTopicDuration(
      topicName
    );

  const baseQuestions =
    getQuestionCount(
      baseDuration,
      resolved.type
    );

  const load =
    resolveReinforcementLoad({
      baseDuration,
      baseQuestions,

      basePriority:
        priorityWithImpact,

      previousAssignments,

      taskType:
        resolved.type,

      examImpact,
    });

  return {
    id: taskId,

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
      resolved.type,

    priority:
      load.priority,

    examImpact,

    role:
      load.role,

    previousAssignments,
  };
}