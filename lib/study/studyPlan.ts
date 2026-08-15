import type {
  SubjectProgressMap,
} from "@/services/topicService";

import type {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

import type {
  AlanOption,
} from "@/types/user";

export type StudyTaskType =
  | "new"
  | "revision"
  | "weak";

export type StudyCategory =
  (typeof YKS_SUBJECTS)[number]["category"];

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
}

export interface GeneratePlanOptions {
  progressMap: SubjectProgressMap;
  dailyHours: number;
  alan?: AlanOption | "";
}

export interface WeeklyStudyPlanDay {
  dayIndex: number;
  tasks: StudyTask[];
  totalMinutes: number;
}