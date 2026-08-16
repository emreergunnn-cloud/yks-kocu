import type {
  TopicStatus,
} from "@/types/topic";

import type {
  AlanOption,
} from "@/types/user";

import type {
  StudyTaskType,
} from "@/types/studyPlan";

import type {
  StudyTaskExamImpact,
} from "@/types/examImpact";

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

interface Options {
  status?: TopicStatus;

  topicIndex: number;

  subjectProgressPct: number;

  subjectId: string;
  topicId: string;

  alan:
    AlanOption | "";
}

interface Result {
  type: StudyTaskType;

  priority: number;

  examImpact?:
    StudyTaskExamImpact;
}

export function getCandidatePriority({
  status,
  topicIndex,
  subjectProgressPct,
  subjectId,
  topicId,
  alan,
}: Options): Result | null {
  const resolved =
    resolveTaskType(status);

  if (!resolved) {
    return null;
  }

  const basePriority =
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

  return {
    type:
      resolved.type,

    examImpact,

    priority:
      basePriority +
      getExamPriorityBoost(
        examImpact,
        resolved.type
      ),
  };
}