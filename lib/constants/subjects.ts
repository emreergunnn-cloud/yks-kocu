import { TYT_SUBJECTS } from "./yks/tyt";
import { AYT_SUBJECTS } from "./yks/ayt";
import type { YksSubjectDefinition } from "./yks/types";
import type { SchoolSubjectDefinition } from "./curriculum/types";

export type SubjectWithTopics =
  | YksSubjectDefinition
  | SchoolSubjectDefinition;

export const YKS_SUBJECTS = [
  ...TYT_SUBJECTS,
  ...AYT_SUBJECTS,
] as const;
