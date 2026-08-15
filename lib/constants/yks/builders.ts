import type {
  AlanOption,
} from "@/types/user";

import type {
  YksCategory,
  YksSubjectDefinition,
  YksTopic,
} from "./types";

export function makeTopics(
  items:
    readonly (
      readonly [string, string]
    )[]
): YksTopic[] {
  return items.map(
    ([id, name]) => ({
      id,
      name,
    })
  );
}

export function makeSubject(
  id: string,
  name: string,
  category: YksCategory,
  questionCount: number,
  topics: readonly YksTopic[],
  allowedTracks?:
    readonly AlanOption[]
): YksSubjectDefinition {
  return {
    id,
    name,
    category,
    questionCount,
    topics,
    allowedTracks,
  };
}