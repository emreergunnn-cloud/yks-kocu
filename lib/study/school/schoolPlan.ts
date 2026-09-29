import { getActiveSubjects } from "@/lib/constants/curriculum/activeSubjects";
import type { SchoolGrade } from "@/lib/constants/curriculum/config";
import type { SubjectProgressMap } from "@/services/topicService";
import type { StudyTask } from "@/types/studyPlan";
import type { StudyTaskProgressMap } from "@/types/studyTaskProgress";
import { makeSchoolCandidate } from "./schoolCandidate";

export function getSchoolStudyPlanCandidates(
  grade: SchoolGrade,
  progressMap: SubjectProgressMap,
  taskProgress: StudyTaskProgressMap = {},
  excludedTaskIds: ReadonlySet<string> = new Set<string>()
): StudyTask[] {
  const queues = getActiveSubjects(grade).map((subject) =>
    subject.topics.map((topic) => makeSchoolCandidate({
      grade, subject, topic, progressMap, taskProgress,
    })).filter((task): task is StudyTask =>
      task !== null && !excludedTaskIds.has(task.id)
    ).sort((a, b) => b.priority - a.priority)
  );

  // A rotating subject order avoids filling a day with only one lesson.
  const result: StudyTask[] = [];
  while (queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next) result.push(next);
    }
  }
  return result;
}
