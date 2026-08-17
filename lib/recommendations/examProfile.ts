import type {
  ExamResult,
} from "@/types/exam";

import type {
  UserProfile,
} from "@/types/user";

import type {
  NetTrend,
  RecommendationExam,
} from "@/types/recommendation";

import {
  getExamTotalNet,
  getLatestExam,
} from "./examTimeline";

export {
  getLatestExam,
} from "./examTimeline";

export function buildNetTrend(
  profile: UserProfile | null,
  exams: ExamResult[],
  scope: RecommendationExam
): NetTrend {
  const latest =
    getLatestExam(
      exams,
      scope
    );

  const latestNet =
    latest
      ? getExamTotalNet(
          latest,
          scope
        )
      : undefined;

  const registrationNet =
    getRegistrationNet(
      profile,
      scope
    );

  const initial =
    registrationNet ??
    latestNet ??
    0;

  const current =
    latestNet ??
    initial;

  const target =
    getTargetNet(
      profile,
      scope
    ) ?? current;

  return {
    initial,
    current,
    target,

    delta:
      current - initial,

    gap:
      Math.max(
        0,
        target - current
      ),
  };
}

export function hasRegistrationBaseline(
  profile: UserProfile | null,
  scope: RecommendationExam
) {
  return (
    getRegistrationNet(
      profile,
      scope
    ) !== undefined
  );
}

function getRegistrationNet(
  profile: UserProfile | null,
  scope: RecommendationExam
) {
  return scope === "TYT"
    ? profile?.currentTYT
    : profile?.currentAYT;
}

function getTargetNet(
  profile: UserProfile | null,
  scope: RecommendationExam
) {
  return scope === "TYT"
    ? profile?.targetTYT
    : profile?.targetAYT;
}