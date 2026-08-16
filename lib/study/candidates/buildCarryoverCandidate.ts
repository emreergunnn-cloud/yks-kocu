import type {
  StudyTask,
  StudyCategory,
} from "@/types/studyPlan";

import type {
  StudyTaskProgress,
} from "@/types/studyTaskProgress";

import type {
  AlanOption,
} from "@/types/user";

import {
  buildExamImpact,
} from "../priority/examImpactCalculator";

import {
  getExamPriorityBoost,
} from "../priority/examPriorityBoost";

import {
  evaluateRemediation,
} from "../remediation/performanceEvaluator";

import {
  getCarryoverDuration,
} from "./carryoverDuration";

interface Options {
  subjectId: string;
  subjectName: string;

  category:
    StudyCategory;

  topicId: string;
  topicName: string;

  alan:
    AlanOption | "";

  history:
    StudyTaskProgress;
}

export function buildCarryoverCandidate({
  subjectId,
  subjectName,
  category,
  topicId,
  topicName,
  alan,
  history,
}: Options): StudyTask {
  const progressTaskId =
    `${subjectId}-${topicId}`;

  const examImpact =
    buildExamImpact({
      subjectId,
      topicId,
      alan,
      taskType:
        "revision",
    });

  const examBoost =
    getExamPriorityBoost(
      examImpact,
      "revision"
    );

  const questions =
    history.remainingQuestions;

  return {
    id:
      `carryover-${progressTaskId}`,

    progressTaskId,

    assignmentKind:
      "carryover",

    subjectId,

    subject:
      subjectName,

    topicId,

    topic:
      topicName,

    category,

    durationMinutes:
      getCarryoverDuration(
        topicName,
        questions
      ),

    questionCount:
      questions,

    type:
      "revision",

    role:
      "reinforcement",

    priority:
      10_000 +
      examBoost +
      questions / 100,

    previousAssignments:
      history.attemptCount,

    carryoverQuestions:
      questions,

    examImpact,

    remediation:
      evaluateRemediation(
        history
      ),
  };
}