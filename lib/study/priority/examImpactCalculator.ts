import {
  findExamImpact,
} from "@/data/yks-impact";

import type {
  StudyTaskType,
} from "@/types/studyPlan";

import type {
  AlanOption,
} from "@/types/user";

import type {
  ExamRiskLevel,
  StudyTaskExamImpact,
} from "@/types/examImpact";

import {
  getSubjectWeight,
} from "./subjectWeights";

const SCORE_SPAN = 400;

const RISK_FACTOR:
  Record<ExamRiskLevel, number> = {
  medium: 0.4,
  high: 0.6,
  "very-high": 0.78,
};

const TASK_FACTOR:
  Record<StudyTaskType, number> = {
  weak: 1,
  new: 0.75,
  revision: 0.5,
};

interface Options {
  subjectId: string;
  topicId: string;
  alan: AlanOption | "";
  taskType: StudyTaskType;
}

export function buildExamImpact({
  subjectId,
  topicId,
  alan,
  taskType,
}: Options):
  StudyTaskExamImpact | undefined {
  const impact =
    findExamImpact(topicId);

  if (!impact) {
    return undefined;
  }

  const subjectWeight =
    getSubjectWeight(
      subjectId,
      alan
    );

  const estimatedPointRisk =
    subjectWeight
      ? calculatePointRisk(
          subjectWeight.weight,
          subjectWeight.questions,
          impact.expectedQuestions,
          impact.riskLevel,
          taskType
        )
      : {
          min: 0,
          max: 0,
        };

  return {
    riskLevel:
      impact.riskLevel,

    expectedQuestions:
      impact.expectedQuestions,

    estimatedPointRisk,

    reason:
      impact.reason,
  };
}

function calculatePointRisk(
  weight: number,
  questionCount: number,
  questions: {
    min: number;
    max: number;
  },
  risk: ExamRiskLevel,
  taskType: StudyTaskType
) {
  const pointPerQuestion =
    (weight / 100) *
    SCORE_SPAN /
    questionCount;

  const factor =
    RISK_FACTOR[risk] *
    TASK_FACTOR[taskType];

  return {
    min: round(
      pointPerQuestion *
        questions.min *
        factor
    ),

    max: round(
      pointPerQuestion *
        questions.max *
        factor
    ),
  };
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}