import type { SinifOption } from "@/types/user";

export const ACTIVE_SCHOOL_YEAR = "2026-2027";

export type CurriculumMode = "maarif" | "yks";

export const CURRICULUM_BY_GRADE: Record<
  SinifOption,
  CurriculumMode
> = {
  "9": "maarif",
  "10": "maarif",
  "11": "maarif",
  "12": "yks",
  Mezun: "yks",
};

export type SchoolGrade = Extract<SinifOption, "9" | "10" | "11">;

export function isSchoolGrade(grade: SinifOption | ""): grade is SchoolGrade {
  return grade === "9" || grade === "10" || grade === "11";
}

export function isYksGrade(
  grade: SinifOption | ""
) {
  return grade === "12" || grade === "Mezun";
}
