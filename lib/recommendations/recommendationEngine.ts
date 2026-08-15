import type {
  ExamResult,
} from "@/types/exam";

import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  UserProfile,
} from "@/types/user";

import type {
  TaskRecommendation,
} from "@/types/recommendation";

import {
  buildNetTrend,
  getLatestExam,
} from "./examProfile";

import {
  resolveExam,
  resolveSubject,
} from "./subjectResolver";

import {
  getSectionRatio,
} from "./sectionNet";

import {
  calculateResourceLevel,
} from "./levelCalculator";

import {
  findBooks,
} from "./bookMatcher";

import {
  createVideoRecommendation,
} from "./videoMatcher";

export function createTaskRecommendation(
  task: StudyTask,
  profile: UserProfile | null,
  exams: ExamResult[]
): TaskRecommendation {
  const exam = resolveExam(task);
  const subject = resolveSubject(task);

  const trend =
    buildNetTrend(
      profile,
      exams,
      exam
    );

  const latest =
    getLatestExam(
      exams,
      exam
    );

  const sectionRatio =
    getSectionRatio(
      latest,
      exam,
      subject
    );

  const level =
    calculateResourceLevel({
      trend,
      exam,
      sectionRatio,
    });

  return {
    level,
    trend,

    books:
      findBooks(
        exam,
        subject,
        level
      ),

    video:
      createVideoRecommendation(
        subject,
        exam,
        task.topic
      ),

    reason:
      createReason(
        trend.delta,
        trend.gap
      ),
  };
}

function createReason(
  delta: number,
  gap: number
) {
  const progress =
    delta > 0
      ? `Başlangıca göre +${delta.toFixed(1)} net gelişim var.`
      : delta < 0
        ? `Başlangıca göre ${delta.toFixed(1)} net değişim var.`
        : "Başlangıç seviyesine yakın ilerliyorsun.";

  return `${progress} Hedefe yaklaşık ${gap.toFixed(1)} net kaldı.`;
}