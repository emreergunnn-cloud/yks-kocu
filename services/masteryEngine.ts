import { YKS_SUBJECTS } from "../lib/constants/subjects";
import type { ExamResult } from "../types/exam";
import type { StudySession } from "./studyService";
import type { SubjectProgressMap } from "./topicService";
import type { StudyTaskProgressMap } from "@/types/studyTaskProgress";
import { applyTaskProgressScore } from "./mastery/taskProgressScore";

export type MasteryLevel =
  | "Kritik Eksik"
  | "Geliştirilmeli"
  | "Orta"
  | "İyi"
  | "Güçlü";

export type MasteryConfidence =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface MasteryResult {
  subjectId: string;
  topicId: string;
  score: number;
  level: MasteryLevel;
  confidence: MasteryConfidence;
}

export function getMasteryLevel(
  score: number
): MasteryLevel {
  if (score <= 24) return "Kritik Eksik";
  if (score <= 44) return "Geliştirilmeli";
  if (score <= 64) return "Orta";
  if (score <= 79) return "İyi";
  return "Güçlü";
}

function getBaseScore(
  progressStatus?: string
): number {
  if (progressStatus === "Tamamlandı") return 60;
  if (progressStatus === "Çalışılıyor") return 40;
  if (progressStatus === "Tekrar Edilecek") return 25;
  return 0;
}


function findTaskProgress(
  subjectId: string,
  topicId: string,
  taskProgress: StudyTaskProgressMap
) {
  return (
    taskProgress[`${subjectId}-${topicId}`] ??
    Object.values(taskProgress).find(
      (item) =>
        item.subjectId === subjectId &&
        item.topicId === topicId
    )
  );
}

export function calculateTopicMastery(
  subjectId: string,
  topicId: string,
  progressStatus: string | undefined,
  exams: ExamResult[],
  studySessions: StudySession[],
  taskProgress: StudyTaskProgressMap = {}
): MasteryResult {
  let score = getBaseScore(progressStatus);
  let confidencePoints = progressStatus ? 1 : 0;

  const taskResult = applyTaskProgressScore(
    score,
    findTaskProgress(
      subjectId,
      topicId,
      taskProgress
    )
  );
  score = taskResult.score;
  confidencePoints += taskResult.confidencePoints;

  const recentExams = [...exams]
    .sort((a, b) => {
      const da = a.createdAt?.seconds || a.createdAt || 0;
      const db = b.createdAt?.seconds || b.createdAt || 0;
      return db - da;
    })
    .slice(0, 5);

  let weakCount = 0;
  let lastWeakDate = 0;

  recentExams.forEach((exam) => {
    if (!(exam.weakTopics || []).includes(topicId)) return;

    weakCount++;
    const time = exam.createdAt?.seconds
      ? exam.createdAt.seconds * 1000
      : 0;
    if (time > lastWeakDate) lastWeakDate = time;
  });

  if (weakCount > 0) {
    score -= weakCount * 5;
    confidencePoints += 3;
  }

  const topicSessions = studySessions.filter(
    (session) =>
      session.subjectId === subjectId &&
      session.topicId === topicId
  );

  let totalStudySecs = 0;
  let lastStudyDate = 0;

  topicSessions.forEach((session) => {
    totalStudySecs += session.duration || 0;
    const time = session.endTime?.seconds
      ? session.endTime.seconds * 1000
      : 0;
    if (time > lastStudyDate) lastStudyDate = time;
  });

  const totalStudyMins = totalStudySecs / 60;
  if (totalStudyMins > 0 && totalStudyMins <= 30) score += 3;
  else if (totalStudyMins > 30 && totalStudyMins <= 60) score += 6;
  else if (totalStudyMins > 60 && totalStudyMins <= 120) score += 10;
  else if (totalStudyMins > 120 && totalStudyMins <= 240) score += 14;
  else if (totalStudyMins > 240) score += 18;

  if (topicSessions.length > 0) confidencePoints += 1;
  if (topicSessions.length > 2) confidencePoints += 1;

  const now = Date.now();
  const msInDay = 86_400_000;

  if (lastStudyDate > 0) {
    const daysSinceStudy = (now - lastStudyDate) / msInDay;
    if (daysSinceStudy <= 1) score += 5;
    else if (daysSinceStudy <= 3) score += 3;
    else if (daysSinceStudy <= 7) score += 1;
  }

  if (lastWeakDate > 0) {
    const daysSinceWeak = (now - lastWeakDate) / msInDay;
    if (daysSinceWeak <= 3) score -= 5;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let confidence: MasteryConfidence = "LOW";
  if (confidencePoints >= 3) confidence = "HIGH";
  else if (confidencePoints >= 1) confidence = "MEDIUM";

  return {
    subjectId,
    topicId,
    score,
    level: getMasteryLevel(score),
    confidence,
  };
}

export function getAllMasteries(
  progressMap: SubjectProgressMap,
  exams: ExamResult[],
  studySessions: StudySession[],
  taskProgress: StudyTaskProgressMap = {}
): Record<string, MasteryResult> {
  const result: Record<string, MasteryResult> = {};

  YKS_SUBJECTS.forEach((subject) => {
    subject.topics.forEach((topic) => {
      const key = `${subject.id}:${topic.id}`;
      result[key] = calculateTopicMastery(
        subject.id,
        topic.id,
        progressMap[subject.id]?.[topic.id],
        exams,
        studySessions,
        taskProgress
      );
    });
  });

  return result;
}
