import type {
  SubjectProgressMap,
} from "@/services/topicService";

import type {
  StudyCategory,
} from "@/types/studyPlan";

import type {
  StudyTaskProgressMap,
} from "@/types/studyTaskProgress";

import type {
  AlanOption,
} from "@/types/user";

export interface CandidateBuildOptions {
  subjectId: string;
  subjectName: string;

  category:
    StudyCategory;

  topicId: string;
  topicName: string;

  topicIndex: number;

  subjectProgressPct: number;

  progressMap:
    SubjectProgressMap;

  alan:
    AlanOption | "";

  taskProgress:
    StudyTaskProgressMap;
}