import { YKS_SUBJECTS } from "@/lib/constants/subjects";
import type { SubjectProgressMap } from "@/services/topicService";

export function getTopicStats(progressMap: SubjectProgressMap) {
  const totalTopics = YKS_SUBJECTS.reduce((total, subject) => total + subject.topics.length, 0);
  const totalCompleted = YKS_SUBJECTS.reduce(
    (total, subject) => total + subject.topics.filter((topic) => progressMap[subject.id]?.[topic.id] === "Tamamlandı").length,
    0
  );
  const topicPercent = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;
  return { totalTopics, totalCompleted, topicPercent };
}
