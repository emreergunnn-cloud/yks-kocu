export type RemediationLevel =
  | "review"
  | "intensive";

export interface StudyRemediation {
  level: RemediationLevel;

  accuracy: number;

  solvedQuestions: number;
  wrongQuestions: number;
  remainingQuestions: number;

  message: string;
}

export type MebResourceKind =
  | "video"
  | "summary"
  | "solved"
  | "practice";

export interface MebResource {
  kind: MebResourceKind;
  label: string;
  url: string;
}