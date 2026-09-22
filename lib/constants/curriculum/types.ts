import type { AlanOption } from "@/types/user";

export type SchoolCategory =
  | "9. Sınıf"
  | "10. Sınıf"
  | "11. Sınıf";

export interface SchoolTopic {
  id: string;
  name: string;
}

export interface SchoolSubjectDefinition {
  id: string;
  name: string;
  category: SchoolCategory;
  questionCount: number;
  allowedTracks?: readonly AlanOption[];
  topics: readonly SchoolTopic[];
}
