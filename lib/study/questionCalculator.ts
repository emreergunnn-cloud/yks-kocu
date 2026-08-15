import type { StudyTaskType } from "@/types/studyPlan";

/**
 * Çalışma süresine göre önerilecek soru sayısı.
 *
 * Amaç:
 * Her konuyu zorla 45 dakika / sabit soru sayısı yapmak yerine
 * konu süresine göre gerçekçi bir soru hedefi üretmek.
 */

export function getQuestionCount(
  durationMinutes: number,
  type: StudyTaskType
): number {
  if (durationMinutes <= 0) {
    return 0;
  }

  // Tekrar çalışmaları daha çok soru çözmeye yönlendirir.
  if (type === "revision") {
    return Math.max(10, Math.round(durationMinutes * 0.45));
  }

  if (durationMinutes >= 75) {
    return 35;
  }

  if (durationMinutes >= 60) {
    return 30;
  }

  if (durationMinutes >= 45) {
    return 25;
  }

  return 15;
}