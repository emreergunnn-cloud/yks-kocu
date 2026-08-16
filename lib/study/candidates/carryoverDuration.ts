import {
  getTopicDuration,
} from "../topicDifficulty";

import {
  getQuestionCount,
} from "../questionCalculator";

export function getCarryoverDuration(
  topicName: string,
  questions: number
): number {
  const baseDuration =
    getTopicDuration(
      topicName
    );

  const baseQuestions =
    Math.max(
      1,
      getQuestionCount(
        baseDuration,
        "revision"
      )
    );

  const minutesPerQuestion =
    baseDuration /
    baseQuestions;

  const rawMinutes =
    questions *
    minutesPerQuestion;

  return Math.max(
    10,
    Math.ceil(
      rawMinutes / 5
    ) * 5
  );
}