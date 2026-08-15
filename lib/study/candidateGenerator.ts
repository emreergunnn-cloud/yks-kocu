import { YKS_SUBJECTS } from "@/lib/constants/subjects";

import {
  computeSubjectStats,
  type SubjectProgressMap,
} from "@/services/topicService";

import type { AlanOption } from "@/types/user";
import type { StudyTask } from "@/types/studyPlan";

import { getTopicDuration } from "./topicDifficulty";
import { getQuestionCount } from "./questionCalculator";

import {
  getNewTopicPriority,
  resolveTaskType,
} from "./studyRules";

import {
  isSubjectAllowedForTrack,
} from "./trackRules";

export function getStudyPlanCandidates(
  progressMap: SubjectProgressMap,
  alan: AlanOption | "" = ""
): StudyTask[] {
  const candidates: StudyTask[] = [];

  for (const subject of YKS_SUBJECTS) {
    if (!isSubjectAllowedForTrack(subject, alan)) {
      continue;
    }

    const stats = computeSubjectStats(
      subject.id,
      subject.topics.map((topic) => topic.id),
      progressMap
    );

    subject.topics.forEach((topic, index) => {
      const status =
        progressMap[subject.id]?.[topic.id];

      const resolved =
        resolveTaskType(status);

      if (!resolved) {
        return;
      }

      const priority =
        resolved.type === "new"
          ? getNewTopicPriority(index, stats.progressPct)
          : resolved.priority;

      const durationMinutes =
        getTopicDuration(topic.name);

      candidates.push({
        id: `${subject.id}-${topic.id}`,
        subjectId: subject.id,
        subject: subject.name,
        topicId: topic.id,
        topic: topic.name,
        category: subject.category,
        durationMinutes,
        questionCount: getQuestionCount(
          durationMinutes,
          resolved.type
        ),
        type: resolved.type,
        priority,
      });
    });
  }

  return candidates.sort(
    (a, b) =>
      b.priority - a.priority ||
      a.subject.localeCompare(b.subject, "tr") ||
      a.topic.localeCompare(b.topic, "tr")
  );
}