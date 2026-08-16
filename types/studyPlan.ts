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

import type {
  StudyTaskProgressMap,
} from "@/types/studyTaskProgress";

import type {
  StudyRemediation,
} from "@/types/remediation";

export type StudyTaskType =
  | "new"
  | "revision"
  | "weak";

export type StudyTaskRole =
  | "main"
  | "reinforcement"
  | "maintenance";

export type StudyTaskKind =
  | "regular"
  | "carryover";

export type StudyCategory =
  (typeof YKS_SUBJECTS)[number]["category"];

export type StudyAssignmentCounts =
  Record<string, number>;

export interface StudyTask {
  id: string;

  progressTaskId?: string;

  assignmentKind?:
    StudyTaskKind;

  subjectId: string;
  subject: string;

  topicId: string;
  topic: string;

  category:
    StudyCategory;

  durationMinutes: number;
  questionCount: number;

  type:
    StudyTaskType;

  priority: number;

  examImpact?:
    StudyTaskExamImpact;

  role?:
    StudyTaskRole;

  previousAssignments?: number;

  carryoverQuestions?: number;

  remediation?:
    StudyRemediation;
}

export interface GeneratePlanOptions {
  progressMap:
    SubjectProgressMap;

  dailyHours: number;

  alan?:
    AlanOption | "";

  taskProgress?:
    StudyTaskProgressMap;

  excludedTaskIds?:
    ReadonlySet<string>;
}

export interface WeeklyStudyPlanDay {
  dayIndex: number;

  tasks:
    StudyTask[];

  totalMinutes: number;
}