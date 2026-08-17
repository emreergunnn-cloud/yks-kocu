import type {
  ExamResult,
} from "@/types/exam";

import type {
  RecommendationExam,
  ResourceSubject,
} from "@/types/recommendation";

import {
  getRecentExams,
  getExamTotalNet,
} from "./examTimeline";

import {
  getSectionRatio,
} from "./sectionNet";

export interface PerformanceSnapshot {
  examCount: number;

  recentOverallRatio:
    number | null;

  recentSectionRatio:
    number | null;
}

export function buildPerformanceSnapshot(
  exams: ExamResult[],
  scope: RecommendationExam,
  subject: ResourceSubject
): PerformanceSnapshot {
  const recent =
    getRecentExams(
      exams,
      scope,
      3
    );

  if (!recent.length) {
    return {
      examCount: 0,
      recentOverallRatio:
        null,
      recentSectionRatio:
        null,
    };
  }

  const examMax =
    scope === "TYT"
      ? 120
      : 80;

  const overallRatios =
    recent.map(
      (exam) =>
        clamp(
          getExamTotalNet(
            exam,
            scope
          ) / examMax
        )
    );

  const sectionRatios =
    recent
      .map(
        (exam) =>
          getSectionRatio(
            exam,
            scope,
            subject
          )
      )
      .filter(
        (
          value
        ): value is number =>
          value !== null
      );

  return {
    examCount:
      recent.length,

    recentOverallRatio:
      average(
        overallRatios
      ),

    recentSectionRatio:
      sectionRatios.length
        ? average(
            sectionRatios
          )
        : null,
  };
}

function average(
  values: number[]
) {
  return (
    values.reduce(
      (total, value) =>
        total + value,
      0
    ) / values.length
  );
}

function clamp(
  value: number
) {
  return Math.max(
    0,
    Math.min(1, value)
  );
}