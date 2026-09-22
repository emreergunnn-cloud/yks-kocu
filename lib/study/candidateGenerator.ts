import { getActiveSubjects } from "@/lib/constants/curriculum/activeSubjects";
import type { SubjectProgressMap } from "@/services/topicService";
import type { StudyTask } from "@/types/studyPlan";
import type { StudyTaskProgressMap } from "@/types/studyTaskProgress";
import type { AlanOption, SinifOption } from "@/types/user";
import { isSubjectAllowedForTrack } from "./trackRules";
import { buildSubjectCandidates } from "./candidates/buildSubjectCandidates";
import { sortStudyCandidates } from "./candidates/sortStudyCandidates";

export function getStudyPlanCandidates(
  progressMap: SubjectProgressMap,
  alan: AlanOption | "" = "",
  taskProgress: StudyTaskProgressMap = {},
  excludedTaskIds: ReadonlySet<string> = new Set<string>(),
  sinif: SinifOption | "" = ""
): StudyTask[] {
  const carryovers: StudyTask[] = [];
  const regular: StudyTask[] = [];
  const subjects = getActiveSubjects(sinif);

  for (const subject of subjects) {
    if (!isSubjectAllowedForTrack(subject, alan)) continue;

    const groups = buildSubjectCandidates({
      subject,
      progressMap,
      alan,
      taskProgress,
      excludedTaskIds,
    });

    carryovers.push(...groups.carryovers);
    regular.push(...groups.regular);
  }

  carryovers.sort(sortStudyCandidates);
  regular.sort(sortStudyCandidates);
  return [...carryovers, ...regular];
}
