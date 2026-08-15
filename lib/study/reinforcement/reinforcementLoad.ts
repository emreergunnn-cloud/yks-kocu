import type {
  StudyTaskExamImpact,
} from "@/types/examImpact";

import type {
  StudyTaskRole,
  StudyTaskType,
} from "@/types/studyPlan";

interface Options {
  baseDuration: number;
  baseQuestions: number;
  basePriority: number;

  previousAssignments: number;

  taskType: StudyTaskType;

  examImpact?:
    StudyTaskExamImpact;
}

interface Result {
  durationMinutes: number;

  questionCount: number;

  priority: number;

  role: StudyTaskRole;
}

const HIGH_QUESTIONS = [
  50,
  30,
  20,
  15,
] as const;

const MEDIUM_QUESTIONS = [
  40,
  25,
  15,
  10,
] as const;

const DURATIONS = [
  60,
  35,
  25,
  20,
] as const;

const PRIORITY_FACTORS = [
  1,
  0.72,
  0.55,
  0.4,
] as const;

export function resolveReinforcementLoad({
  baseDuration,
  baseQuestions,
  basePriority,
  previousAssignments,
  taskType,
  examImpact,
}: Options): Result {
  if (!examImpact) {
    return {
      durationMinutes:
        baseDuration,

      questionCount:
        baseQuestions,

      priority:
        basePriority,

      role: "main",
    };
  }

  const unresolved =
    taskType !== "new" ||
    previousAssignments > 0;

  if (!unresolved) {
    return {
      durationMinutes:
        baseDuration,

      questionCount:
        baseQuestions,

      priority:
        basePriority,

      role: "main",
    };
  }

  const stage = Math.min(
    previousAssignments,
    3
  );

  const questions =
    examImpact.riskLevel ===
    "medium"
      ? MEDIUM_QUESTIONS
      : HIGH_QUESTIONS;

  const role:
    StudyTaskRole =
    stage === 0
      ? "main"
      : stage < 3
        ? "reinforcement"
        : "maintenance";

  return {
    durationMinutes:
      stage === 0
        ? Math.max(
            baseDuration,
            DURATIONS[stage]
          )
        : DURATIONS[stage],

    questionCount:
      questions[stage],

    priority:
      Math.round(
        basePriority *
          PRIORITY_FACTORS[
            stage
          ]
      ),

    role,
  };
}