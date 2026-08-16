export interface StudyTaskProgress {
  taskId: string;
  subjectId: string;
  topicId: string;

  attemptCount: number;

  lastAssignedQuestions: number;
  lastSolvedQuestions: number;

  lastCorrect: number;
  lastWrong: number;
  lastBlank: number;

  remainingQuestions: number;
  accuracy: number;
}

export type StudyTaskProgressMap =
  Record<
    string,
    StudyTaskProgress
  >;

export interface StudyTaskResultSummary {
  assignedQuestions: number;
  solvedQuestions: number;

  correct: number;
  wrong: number;
  blank: number;

  remainingQuestions: number;
  accuracy: number;
}

export interface SubmitStudyTaskResult {
  uid: string;

  taskId: string;
  subjectId: string;
  topicId: string;

  assignedQuestions: number;
  solvedQuestions: number;

  correct: number;
  wrong: number;

  calendarEventId?: string;

  expectedPreviousAttempts?: number;
}