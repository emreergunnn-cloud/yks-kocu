import type {
  ExamResult,
  SectionScore,
} from "@/types/exam";

import type {
  RecommendationExam,
  ResourceSubject,
} from "@/types/recommendation";

function net(
  value:
    | SectionScore
    | number
    | undefined
) {
  if (typeof value === "number") {
    return value;
  }

  return value?.net;
}

function ratio(
  value: number | undefined,
  max: number
) {
  if (value === undefined) {
    return null;
  }

  return Math.max(
    0,
    Math.min(1, value / max)
  );
}

export function getSectionRatio(
  exam: ExamResult | undefined,
  scope: RecommendationExam,
  subject: ResourceSubject
): number | null {
  if (!exam) return null;

  if (scope === "TYT") {
    if (subject === "mathematics") {
      return ratio(net(exam.tytMat), 40);
    }

    if (subject === "turkish") {
      return ratio(net(exam.tytTurkce), 40);
    }

    if (
      ["physics", "chemistry", "biology"]
        .includes(subject)
    ) {
      return ratio(net(exam.tytFen), 20);
    }

    return ratio(net(exam.tytSosyal), 20);
  }

  const map: Partial<
    Record<
      ResourceSubject,
      [SectionScore | number | undefined, number]
    >
  > = {
    mathematics: [exam.aytMat, 40],
    physics: [exam.aytFizik, 14],
    chemistry: [exam.aytKimya, 13],
    biology: [exam.aytBiyoloji, 13],
    literature: [exam.aytEdebiyat, 24],
    philosophy: [exam.aytFelsefe, 12],
    religion: [exam.aytDin, 6],
    language: [exam.aytDil, 80],
  };

  const entry = map[subject];

  if (!entry) return null;

  return ratio(
    net(entry[0]),
    entry[1]
  );
}