import {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

import {
  computeSubjectStats,
  type SubjectProgressMap,
} from "@/services/topicService";

import type {
  AlanOption,
} from "@/types/user";

import type {
  StudyAssignmentCounts,
  StudyTask,
} from "@/types/studyPlan";

import {
  isSubjectAllowedForTrack,
} from "./trackRules";

import {
  buildStudyCandidate,
} from "./candidates/buildStudyCandidate";

export function getStudyPlanCandidates(
  progressMap:
    SubjectProgressMap,

  alan:
    AlanOption | "" = "",

  assignmentCounts:
    StudyAssignmentCounts = {}
): StudyTask[] {
  const candidates:
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

    const stats =
      computeSubjectStats(
        subject.id,

        subject.topics.map(
          (topic) =>
            topic.id
        ),

        progressMap
      );

    subject.topics.forEach(
      (topic, topicIndex) => {
        const candidate =
          buildStudyCandidate({
            subjectId:
              subject.id,

            subjectName:
              subject.name,

            category:
              subject.category,

            topicId:
              topic.id,

            topicName:
              topic.name,

            topicIndex,

            subjectProgressPct:
              stats.progressPct,

            progressMap,
            alan,
            assignmentCounts,
          });

        if (candidate) {
          candidates.push(
            candidate
          );
        }
      }
    );
  }

  return candidates.sort(
    (a, b) =>
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