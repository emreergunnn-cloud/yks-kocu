import type {
  StudyTask,
} from "@/types/studyPlan";

export function sortStudyCandidates(
  a: StudyTask,
  b: StudyTask
): number {
  return (
    b.priority -
      a.priority ||
    a.subject.localeCompare(
      b.subject,
      "tr"
    ) ||
    a.topic.localeCompare(
      b.topic,
      "tr"
    )
  );
}