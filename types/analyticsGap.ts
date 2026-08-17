import type {
  StudyRemediation,
} from "@/types/remediation";

export interface AnalyticsGap {
  taskId: string;

  subjectId: string;
  subject: string;

  topicId: string;
  topic: string;

  attemptCount: number;

  assignedQuestions: number;
  solvedQuestions: number;

  correct: number;
  wrong: number;
  blank: number;

  remainingQuestions: number;

  accuracy: number;

  remediation?:
    StudyRemediation;
}

export interface AnalyticsGaps {
  homework:
    AnalyticsGap[];

  topics:
    AnalyticsGap[];

  totalRemainingQuestions:
    number;
}