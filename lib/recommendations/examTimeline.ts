import type {
  ExamResult,
} from "@/types/exam";

import type {
  RecommendationExam,
} from "@/types/recommendation";

export function getScopedExams(
  exams: ExamResult[],
  scope: RecommendationExam
): ExamResult[] {
  return exams
    .filter(
      (exam) =>
        isExamInScope(
          exam,
          scope
        )
    )
    .sort(
      (a, b) =>
        getExamTime(a) -
        getExamTime(b)
    );
}

export function getLatestExam(
  exams: ExamResult[],
  scope: RecommendationExam
) {
  const scoped =
    getScopedExams(
      exams,
      scope
    );

  return scoped[
    scoped.length - 1
  ];
}

export function getRecentExams(
  exams: ExamResult[],
  scope: RecommendationExam,
  count = 3
) {
  return getScopedExams(
    exams,
    scope
  ).slice(-count);
}

export function getExamTotalNet(
  exam: ExamResult,
  scope: RecommendationExam
) {
  return scope === "TYT"
    ? exam.tytToplamNet
    : exam.aytToplamNet;
}

function isExamInScope(
  exam: ExamResult,
  scope: RecommendationExam
) {
  if (scope === "TYT") {
    return (
      exam.denemeTipi === "TYT" ||
      exam.denemeTipi ===
        "TYT+AYT"
    );
  }

  return (
    exam.denemeTipi === "AYT" ||
    exam.denemeTipi ===
      "TYT+AYT"
  );
}

function getExamTime(
  exam: ExamResult
) {
  if (exam.sinavTarihi) {
    return new Date(
      exam.sinavTarihi
    ).getTime();
  }

  const createdAt =
    exam.createdAt as {
      seconds?: number;
      toMillis?: () => number;
    };

  if (
    typeof createdAt
      ?.toMillis === "function"
  ) {
    return createdAt.toMillis();
  }

  return (
    Number(
      createdAt?.seconds ?? 0
    ) * 1000
  );
}