import type { YKS_SUBJECTS } from "@/lib/constants/subjects";
import type { StudyTaskType } from "@/types/studyPlan";

export type YksSubject = (typeof YKS_SUBJECTS)[number];

/**
 * Şimdilik bütün dersler açık.
 *
 * Alan filtresi geldiğinde sadece bu dosyayı değiştireceğiz.
 *
 * Örneğin:
 * Sayısal:
 * - AYT Edebiyat ❌
 * - AYT Tarih ❌
 * - AYT Coğrafya ❌
 *
 * Eşit Ağırlık:
 * - AYT Fizik ❌
 * - AYT Kimya ❌
 * - AYT Biyoloji ❌
 */
export function isAllowedSubject(
  subject: YksSubject
): boolean {
  return true;
}

/**
 * Konunun mevcut durumuna göre görev tipini belirler.
 */
export function resolveTaskType(
  status: string | undefined
): {
  type: StudyTaskType;
  priority: number;
} | null {
  if (status === "Tekrar Edilecek") {
    return {
      type: "revision",
      priority: 100,
    };
  }

  if (status === "Çalışılıyor") {
    return {
      type: "weak",
      priority: 80,
    };
  }

  if (!status || status === "Başlanmadı") {
    return {
      type: "new",
      priority: 60,
    };
  }

  return null;
}

/**
 * Yeni konular için başlangıç konularına öncelik verir.
 *
 * index = 0 olan konu daha yüksek önceliklidir.
 */
export function getNewTopicPriority(
  topicIndex: number,
  subjectProgressPercent: number
): number {
  let priority = Math.max(
    10,
    60 - topicIndex * 2
  );

  // Ders genel olarak gerideyse önceliği artır.
  if (subjectProgressPercent < 30) {
    priority += 15;
  }

  return priority;
}