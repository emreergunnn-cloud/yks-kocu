import {
  getStudyTaskProgress,
} from "@/services/studyTaskProgressService";

import {
  getTopicProgress,
  type SubjectProgressMap,
} from "@/services/topicService";

import {
  deriveTopicStatusFromTaskProgress,
} from "./deriveStatusFromStudyResult";

export async function loadResolvedTopicProgress(
  uid: string
): Promise<SubjectProgressMap> {
  const [savedProgress, taskProgress] =
    await Promise.all([
      getTopicProgress(uid),
      getStudyTaskProgress(uid),
    ]);

  const resolved: SubjectProgressMap =
    Object.fromEntries(
      Object.entries(savedProgress).map(
        ([subjectId, topics]) => [
          subjectId,
          { ...topics },
        ]
      )
    );

  Object.values(taskProgress).forEach(
    (progress) => {
      if (!progress.subjectId || !progress.topicId) {
        return;
      }

      const current =
        resolved[progress.subjectId]?.[
          progress.topicId
        ];

      if (
        current &&
        current !== "Başlanmadı"
      ) {
        return;
      }

      resolved[progress.subjectId] = {
        ...resolved[progress.subjectId],
        [progress.topicId]:
          deriveTopicStatusFromTaskProgress(
            progress
          ),
      };
    }
  );

  return resolved;
}
