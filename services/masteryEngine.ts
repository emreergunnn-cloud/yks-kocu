import { ExamResult } from "../types/exam";
import { StudySession } from "./studyService";
import { SubjectProgressMap } from "./topicService";
import { YKS_SUBJECTS } from "../lib/constants/subjects";

export type MasteryLevel = "Kritik Eksik" | "Geliştirilmeli" | "Orta" | "İyi" | "Güçlü";
export type MasteryConfidence = "LOW" | "MEDIUM" | "HIGH";

export interface MasteryResult {
  topicId: string;
  score: number;
  level: MasteryLevel;
  confidence: MasteryConfidence;
}

export function getMasteryLevel(score: number): MasteryLevel {
  if (score <= 24) return "Kritik Eksik";
  if (score <= 44) return "Geliştirilmeli";
  if (score <= 64) return "Orta";
  if (score <= 79) return "İyi";
  return "Güçlü";
}

export function calculateTopicMastery(
  topicId: string,
  progressStatus: string | undefined,
  exams: ExamResult[],
  studySessions: StudySession[]
): MasteryResult {
  let score = 0;
  let confidencePoints = 0;

  // 1. BASE SCORE
  if (progressStatus === "Tamamlandı") {
    score += 60;
    confidencePoints += 1;
  } else if (progressStatus === "Çalışılıyor") {
    score += 40;
    confidencePoints += 1;
  } else if (progressStatus === "Tekrar Edilecek") {
    score += 25;
    confidencePoints += 1;
  } else {
    score += 10;
  }

  // 2. WEAK TOPIC ETKİSİ
  const sortedExams = [...exams].sort((a, b) => {
    const da = a.createdAt?.seconds || a.createdAt || 0;
    const db = b.createdAt?.seconds || b.createdAt || 0;
    return db - da; 
  });
  
  const recentExams = sortedExams.slice(0, 5);
  let weakCount = 0;
  let lastWeakDate = 0;
  
  recentExams.forEach(exam => {
    const weakTopics = exam.weakTopics || [];
    if (weakTopics.includes(topicId)) {
      weakCount++;
      const time = exam.createdAt?.seconds ? exam.createdAt.seconds * 1000 : 0;
      if (time > lastWeakDate) lastWeakDate = time;
    }
  });

  if (weakCount > 0) {
    score -= (weakCount * 5);
    confidencePoints += 2;
  } else if (recentExams.length > 0) {
    confidencePoints += 1;
  }

  // 3. STUDY ETKİSİ
  const topicSessions = studySessions.filter(s => s.topicId === topicId);
  let totalStudySecs = 0;
  let lastStudyDate = 0;

  topicSessions.forEach(s => {
    totalStudySecs += s.duration || 0;
    const time = s.endTime?.seconds ? s.endTime.seconds * 1000 : 0;
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

  // 4. RECENCY
  const now = Date.now();
  const msInDay = 86400000;
  if (lastStudyDate > 0) {
    const daysSinceStudy = (now - lastStudyDate) / msInDay;
    if (daysSinceStudy <= 1) score += 5;
    else if (daysSinceStudy <= 3) score += 3;
    else if (daysSinceStudy <= 7) score += 1;
  }

  // 5. WEAK RECENCY PENALTY
  if (lastWeakDate > 0) {
    const daysSinceWeak = (now - lastWeakDate) / msInDay;
    if (daysSinceWeak <= 3) {
      score -= 5;
    }
  }

  // 6. CLAMP & CONFIDENCE
  score = Math.max(0, Math.min(100, Math.round(score)));

  let confidence: MasteryConfidence = "LOW";
  if (confidencePoints >= 3) confidence = "HIGH";
  else if (confidencePoints >= 1) confidence = "MEDIUM";

  return {
    topicId,
    score,
    level: getMasteryLevel(score),
    confidence
  };
}

export function getAllMasteries(
  progressMap: SubjectProgressMap,
  exams: ExamResult[],
  studySessions: StudySession[]
): Record<string, MasteryResult> {
  const result: Record<string, MasteryResult> = {};
  
  YKS_SUBJECTS.forEach(sub => {
    sub.topics.forEach(topic => {
      const status = progressMap[sub.id]?.[topic.id];
      result[topic.id] = calculateTopicMastery(topic.id, status, exams, studySessions);
    });
  });

  return result;
}
