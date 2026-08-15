export type ExamRiskLevel =
  | "medium"
  | "high"
  | "very-high";

export interface QuestionRange {
  min: number;
  max: number;
}

export interface ExamImpactDefinition {
  topicId: string;
  riskLevel: ExamRiskLevel;
  expectedQuestions: QuestionRange;
  reason: string;
}

export interface PointRange {
  min: number;
  max: number;
}

export interface StudyTaskExamImpact {
  riskLevel: ExamRiskLevel;
  expectedQuestions: QuestionRange;
  estimatedPointRisk: PointRange;
  reason: string;
}