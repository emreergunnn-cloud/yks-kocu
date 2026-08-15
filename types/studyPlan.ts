import type {
  SubjectProgressMap,
} from "@/services/topicService";

import type {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

import type {
  AlanOption,
} from "@/types/user";

import type {
  StudyTaskExamImpact,
} from "@/types/examImpact";

export type StudyTaskType =
  | "new"
  | "revision"
  | "weak";

export type StudyTaskRole =
  | "main"
  | "reinforcement"
  | "maintenance";

export type StudyCategory =
  (typeof YKS_SUBJECTS)[number]["category"];

export type StudyAssignmentCounts =
  Record<string, number>;

export interface StudyTask {
  id: string;

  subjectId: string;
  subject: string;

  topicId: string;
  topic: string;

  category: StudyCategory;

  durationMinutes: number;
  questionCount: number;

  type: StudyTaskType;
  priority: number;

  examImpact?:
    StudyTaskExamImpact;

  role?: StudyTaskRole;

  previousAssignments?: number;
}

export interface GeneratePlanOptions {
  progressMap:
    SubjectProgressMap;

  dailyHours: number;

  alan?: AlanOption | "";

  assignmentCounts?:
    StudyAssignmentCounts;
}

export interface WeeklyStudyPlanDay {
  dayIndex: number;

  tasks: StudyTask[];

  totalMinutes: number;
}