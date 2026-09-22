import { YKS_SUBJECTS, type SubjectWithTopics } from "@/lib/constants/subjects";
import type { SubjectProgressMap } from "@/services/topicService";

export function getTopicStats(
  progressMap: SubjectProgressMap,
  subjects: readonly SubjectWithTopics[] = YKS_SUBJECTS
) {
  const totalTopics = subjects.reduce(
    (total, subject) => total + subject.topics.length,
    0
  );
  const totalCompleted = subjects.reduce(
    (total, subject) => total + subject.topics.filter(
      (topic) => progressMap[subject.id]?.[topic.id] === "Tamamlandı"
    ).length,
    0
  );
  const topicPercent = totalTopics > 0
    ? Math.round((totalCompleted / totalTopics) * 100)
    : 0;
  return { totalTopics, totalCompleted, topicPercent };
}
