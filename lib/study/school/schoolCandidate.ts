import type { SchoolGrade } from "@/lib/constants/curriculum/config";
import type { SubjectWithTopics } from "@/lib/constants/subjects";
import type { SubjectProgressMap } from "@/services/topicService";
import type { StudyTask } from "@/types/studyPlan";
import type { StudyTaskProgressMap } from "@/types/studyTaskProgress";

interface Input {
  grade: SchoolGrade;
  subject: SubjectWithTopics;
  topic: SubjectWithTopics["topics"][number];
  progressMap: SubjectProgressMap;
  taskProgress: StudyTaskProgressMap;
}

export function makeSchoolCandidate({
  grade, subject, topic, progressMap, taskProgress,
}: Input): StudyTask | null {
  const taskId = `${subject.id}-${topic.id}`;
  const history = taskProgress[taskId];
  const remaining = Math.max(0, history?.remainingQuestions ?? 0);
  const status = progressMap[subject.id]?.[topic.id];
  if (status === "Tamamlandı" && remaining === 0) return null;

  const carryover = remaining > 0;
  const isReview = status === "Tekrar Edilecek";
  const isStudying = status === "Çalışılıyor";
  const type = carryover || isReview ? "revision" : isStudying ? "weak" : "new";
  const durationMinutes = carryover
    ? Math.min(75, Math.max(25, Math.ceil(remaining * 2.5 / 5) * 5))
    : type === "revision" ? 35 : type === "weak" ? 45 : 40;
  const questionCount = carryover ? remaining : type === "new" ? 12 : 15;

  return {
    id: carryover ? `carryover-${taskId}` : taskId,
    progressTaskId: taskId,
    assignmentKind: carryover ? "carryover" : "regular",
    subjectId: subject.id,
    subject: subject.name,
    topicId: topic.id,
    topic: topic.name,
    category: `${grade}. Sınıf` as StudyTask["category"],
    durationMinutes, questionCount, type,
    priority: carryover ? 4 : isReview ? 3 : isStudying ? 2 : 1,
    role: carryover ? "reinforcement" : "main",
    previousAssignments: history?.attemptCount ?? 0,
    carryoverQuestions: carryover ? remaining : 0,
  };
}
