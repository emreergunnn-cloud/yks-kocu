import {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

import type {
  SubjectProgressMap,
} from "@/services/topicService";

import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  StudyTaskProgressMap,
} from "@/types/studyTaskProgress";

import type {
  AlanOption,
} from "@/types/user";

import {
  isSubjectAllowedForTrack,
} from "./trackRules";

import {
  buildSubjectCandidates,
} from "./candidates/buildSubjectCandidates";

import {
  sortStudyCandidates,
} from "./candidates/sortStudyCandidates";

export function getStudyPlanCandidates(
  progressMap:
    SubjectProgressMap,

  alan:
    AlanOption | "" = "",

  taskProgress:
    StudyTaskProgressMap = {},

  excludedTaskIds:
    ReadonlySet<string> =
      new Set<string>()
): StudyTask[] {
  const carryovers:
    StudyTask[] = [];

  const regular:
    StudyTask[] = [];

  for (
    const subject
    of YKS_SUBJECTS
  ) {
    if (
      !isSubjectAllowedForTrack(
        subject,
        alan
      )
    ) {
      continue;
    }

    const groups =
      buildSubjectCandidates({
        subject,
        progressMap,
        alan,
        taskProgress,
        excludedTaskIds,
      });

    carryovers.push(
      ...groups.carryovers
    );

    regular.push(
      ...groups.regular
    );
  }

  carryovers.sort(
    sortStudyCandidates
  );

  regular.sort(
    sortStudyCandidates
  );

  return [
    ...carryovers,
    ...regular,
  ];
}