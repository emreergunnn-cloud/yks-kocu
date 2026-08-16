import type {
  StudyTaskExamImpact,
} from "@/types/examImpact";

import type {
  StudyTaskType,
} from "@/types/studyPlan";

import {
  getTopicDuration,
} from "../topicDifficulty";

import {
  getQuestionCount,
} from "../questionCalculator";

import {
  resolveReinforcementLoad,
} from "../reinforcement/reinforcementLoad";

import {
  applyCarryoverLoad,
} from "../remediation/carryoverLoad";

interface Options {
  topicName: string;

  taskType:
    StudyTaskType;

  priority: number;

  previousAssignments: number;

  carryoverQuestions: number;

  examImpact?:
    StudyTaskExamImpact;
}

export function getCandidateLoad({
  topicName,
  taskType,
  priority,
  previousAssignments,
  carryoverQuestions,
  examImpact,
}: Options) {
  const baseDuration =
    getTopicDuration(
      topicName
    );

  const baseQuestions =
    getQuestionCount(
      baseDuration,
      taskType
    );

  const reinforcement =
    resolveReinforcementLoad({
      baseDuration,
      baseQuestions,

      basePriority:
        priority,

      previousAssignments,

      taskType,

      examImpact,
    });

  const finalLoad =
    applyCarryoverLoad({
      durationMinutes:
        reinforcement
          .durationMinutes,

      questionCount:
        reinforcement
          .questionCount,

      remainingQuestions:
        carryoverQuestions,
    });

  return {
    ...reinforcement,

    durationMinutes:
      finalLoad
        .durationMinutes,

    questionCount:
      finalLoad
        .questionCount,
  };
}