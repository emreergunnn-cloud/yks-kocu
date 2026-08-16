interface Values {
  assigned: number;

  solved: number;

  correct: number;

  wrong: number;
}

export function validateHomeworkResult({
  assigned,
  solved,
  correct,
  wrong,
}: Values): string | null {
  if (
    !Number.isInteger(
      solved
    ) ||
    !Number.isInteger(
      correct
    ) ||
    !Number.isInteger(
      wrong
    )
  ) {
    return "Soru sayıları tam sayı olmalı.";
  }

  if (
    solved <= 0 ||
    solved > assigned
  ) {
    return "Çözülen soru sayısını kontrol et.";
  }

  if (
    correct < 0 ||
    wrong < 0 ||
    correct + wrong >
      solved
  ) {
    return "Doğru ve yanlış sayılarını kontrol et.";
  }

  return null;
}