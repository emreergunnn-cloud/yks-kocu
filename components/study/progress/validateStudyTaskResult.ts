interface Values {
  solved: number;
  correct: number;
  wrong: number;
}

export function validateStudyTaskResult(
  assignedQuestions: number,
  values: Values
): string | null {
  const {
    solved,
    correct,
    wrong,
  } = values;

  if (
    !Number.isInteger(solved) ||
    !Number.isInteger(correct) ||
    !Number.isInteger(wrong)
  ) {
    return "Soru sayıları tam sayı olmalı.";
  }

  if (
    solved <= 0 ||
    solved > assignedQuestions
  ) {
    return "Çözülen soru sayısını kontrol et.";
  }

  if (
    correct < 0 ||
    wrong < 0 ||
    correct + wrong > solved
  ) {
    return "Doğru ve yanlış sayılarını kontrol et.";
  }

  return null;
}