import type { AlanOption, SinifOption } from "@/types/user";

export const ACTIVE_SCHOOL_YEAR = "2026-2027";

export type CurriculumMode = "maarif" | "yks";

export const CURRICULUM_BY_GRADE: Record<SinifOption, CurriculumMode> = {
  "9": "maarif",
  "10": "maarif",
  "11": "maarif",
  "12": "yks",
  Mezun: "yks",
};

export type SchoolGrade = Extract<SinifOption, "9" | "10" | "11">;

const ALL_ALAN_OPTIONS: readonly AlanOption[] = [
  "Sayısal",
  "Eşit Ağırlık",
  "Sözel",
  "Dil",
];

const GRADE_11_ALAN_OPTIONS: readonly AlanOption[] = [
  "Sayısal",
  "Eşit Ağırlık",
];

export function isSchoolGrade(grade: SinifOption | ""): grade is SchoolGrade {
  return grade === "9" || grade === "10" || grade === "11";
}

export function isYksGrade(grade: SinifOption | "") {
  return grade === "12" || grade === "Mezun";
}

export function getAlanOptions(grade: SinifOption | ""): readonly AlanOption[] {
  if (grade === "11") return GRADE_11_ALAN_OPTIONS;
  if (isYksGrade(grade)) return ALL_ALAN_OPTIONS;
  return [];
}

export function gradeRequiresAlan(grade: SinifOption | "") {
  return grade === "11" || isYksGrade(grade);
}

export function normalizeAlanForGrade(
  grade: SinifOption | "",
  alan: AlanOption | ""
): AlanOption | "" {
  return getAlanOptions(grade).includes(alan as AlanOption) ? alan : "";
}
