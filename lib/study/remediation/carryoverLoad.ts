interface Options {
  durationMinutes: number;

  questionCount: number;

  remainingQuestions: number;
}

export function applyCarryoverLoad({
  durationMinutes,
  questionCount,
  remainingQuestions,
}: Options) {
  if (
    remainingQuestions <= 0
  ) {
    return {
      durationMinutes,
      questionCount,
    };
  }

  const perQuestion =
    questionCount > 0
      ? durationMinutes /
        questionCount
      : 1.5;

  const extraMinutes =
    Math.ceil(
      (
        remainingQuestions *
        perQuestion
      ) / 5
    ) * 5;

  return {
    durationMinutes:
      durationMinutes +
      Math.max(
        5,
        extraMinutes
      ),

    questionCount:
      questionCount +
      remainingQuestions,
  };
}