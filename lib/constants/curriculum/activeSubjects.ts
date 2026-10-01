import type { AlanOption, SinifOption } from "@/types/user";
import { YKS_SUBJECTS, type SubjectWithTopics } from "../subjects";
import { MAARIF_GRADE_9_SUBJECTS } from "./maarif/grade9";
import { MAARIF_GRADE_10_SUBJECTS } from "./maarif/grade10";
import {
  getGrade11Subjects,
  MAARIF_GRADE_11_SUBJECTS,
} from "./maarif/grade11";

export const ALL_SUBJECTS: readonly SubjectWithTopics[] = [
  ...MAARIF_GRADE_9_SUBJECTS,
  ...MAARIF_GRADE_10_SUBJECTS,
  ...MAARIF_GRADE_11_SUBJECTS,
  ...YKS_SUBJECTS,
];

export function getActiveSubjects(
  grade: SinifOption | "",
  alan: AlanOption | "" = ""
): readonly SubjectWithTopics[] {
  if (grade === "9") return MAARIF_GRADE_9_SUBJECTS;
  if (grade === "10") return MAARIF_GRADE_10_SUBJECTS;
  if (grade === "11") return getGrade11Subjects(alan);
  return YKS_SUBJECTS;
}

export function findSubjectById(
  subjectId: string
): SubjectWithTopics | undefined {
  return ALL_SUBJECTS.find((subject) => subject.id === subjectId);
}
