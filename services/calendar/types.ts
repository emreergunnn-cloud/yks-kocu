import type {
  Timestamp,
} from "firebase/firestore";

import type {
  StudyRemediation,
} from "@/types/remediation";

import type {
  StudyTaskKind,
  StudyTaskType,
} from "@/types/studyPlan";

export type CalendarEventType =
  | "exam"
  | "study"
  | "goal";

export type HomeworkStatus =
  | "assigned"
  | "completed";

export interface CalendarEvent {
  id: string;

  date: string;
  title: string;

  type:
    CalendarEventType;

  color: string;

  notes?: string;

  durationMinutes?: number;

  source?: string;

  subjectId?: string;
  topicId?: string;

  studyTaskId?: string;

  progressTaskId?: string;

  assignmentKind?:
    StudyTaskKind;

  studyTaskType?:
    StudyTaskType;

  questionCount?: number;

  carryoverQuestions?: number;

  previousAssignments?: number;

  remediation?:
    StudyRemediation;

  homeworkStatus?:
    HomeworkStatus;

  solvedQuestions?: number;

  correctQuestions?: number;

  wrongQuestions?: number;

  blankQuestions?: number;

  remainingQuestions?: number;

  accuracy?: number;

  createdAt?:
    Timestamp;

  resultSubmittedAt?:
    Timestamp;
}

export interface CreateCalendarEventInput {
  date: string;

  title: string;

  type?:
    | "study"
    | "goal";

  notes?: string;

  durationMinutes?: number;
}