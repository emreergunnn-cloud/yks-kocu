import type {
  AlanOption,
} from "@/types/user";

export type YksCategory =
  | "TYT"
  | "AYT";

export interface YksTopic {
  id: string;
  name: string;
}

export interface YksSubjectDefinition {
  id: string;
  name: string;
  category: YksCategory;
  questionCount: number;

  allowedTracks?:
    readonly AlanOption[];

  topics:
    readonly YksTopic[];
}