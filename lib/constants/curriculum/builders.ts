import type { AlanOption } from "@/types/user";
import type {
  SchoolCategory,
  SchoolSubjectDefinition,
  SchoolTopic,
} from "./types";

export function makeSchoolTopics(
  items: readonly (readonly [string, string])[]
): SchoolTopic[] {
  return items.map(([id, name]) => ({ id, name }));
}

export function makeSchoolSubject(
  id: string,
  name: string,
  category: SchoolCategory,
  topics: readonly SchoolTopic[],
  allowedTracks?: readonly AlanOption[]
): SchoolSubjectDefinition {
  return {
    id,
    name,
    category,
    questionCount: 0,
    topics,
    allowedTracks,
  };
}
