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
  hasRegistrationBaseline,
} from "./examProfile";

import {
  resolveExam,
  resolveSubject,
} from "./subjectResolver";

import {
  buildPerformanceSnapshot,
} from "./performanceSnapshot";

import {
  calculateResourceLevel,
} from "./levelCalculator";

import {
  findBooks,
} from "./bookMatcher";

import {
  createVideoRecommendation,
} from "./videoMatcher";

import {
  buildRecommendationReason,
} from "./reasonBuilder";

export function createTaskRecommendation(
  task: StudyTask,
  profile: UserProfile | null,
  exams: ExamResult[]
): TaskRecommendation {
  const exam =
    resolveExam(task);

  const subject =
    resolveSubject(task);

  const trend =
    buildNetTrend(
      profile,
      exams,
      exam
    );

  const performance =
    buildPerformanceSnapshot(
      exams,
      exam,
      subject
    );

  const level =
    calculateResourceLevel({
      trend,
      exam,

      sectionRatio:
        performance
          .recentSectionRatio,

      recentOverallRatio:
        performance
          .recentOverallRatio,
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
      buildRecommendationReason({
        trend,
        exam,

        examCount:
          performance.examCount,

        hasBaseline:
          hasRegistrationBaseline(
            profile,
            exam
          ),
      }),
  };
}