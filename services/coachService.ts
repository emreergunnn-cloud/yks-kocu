import { calculateTarget } from "./rankingService";

export interface CoachInput {
  alan: string;
  targetRanking: number;
  currentTYT: number;
  currentAYT: number;
  obp: number;
  studyDays: number;
  studyHours: number;
}

export interface DailyTask {
  title: string;
  duration: number;
}

export interface CoachReport {
  targetProbability: number;
  risk: "LOW" | "MEDIUM" | "HIGH";

  targetTYT: number;
  targetAYT: number;

  recommendedDailyHours: number;

  weakLessons: string[];
  strongLessons: string[];

  todayTasks: DailyTask[];

  coachMessage: string;
}

function getRecommendedHours(rank: number): number {
  if (rank <= 1000) return 8;
  if (rank <= 5000) return 7;
  if (rank <= 10000) return 6;
  if (rank <= 30000) return 5;
  if (rank <= 60000) return 4;

  return 3;
}

export function generateCoachReport(
  input: CoachInput
): CoachReport {
  const target = calculateTarget(
    input.alan,
    input.targetRanking,
    2025
  );

  /*
   * TYT ve AYT ayrı ayrı değerlendirilir.
   *
   * Eski sistemdeki:
   *
   * currentTYT + currentAYT
   *
   * şeklindeki "genel net" mantığı kullanılmaz.
   */

  const tytProgress =
    target.tyt > 0
      ? input.currentTYT / target.tyt
      : 0;

  const aytProgress =
    target.ayt > 0
      ? input.currentAYT / target.ayt
      : 0;

  /*
   * Hedefe yakınlık hesabında:
   *
   * TYT %45
   * AYT %55
   *
   * ağırlıklandırması kullanılıyor.
   *
   * Böylece AYT'nin sıralama üzerindeki etkisi
   * biraz daha güçlü değerlendiriliyor.
   */

  let probability = Math.round(
    (tytProgress * 0.45 + aytProgress * 0.55) *
      100
  );

  /*
   * Diploma/OBP küçük bir destek katsayısı.
   *
   * Burada OBP sıralama hesaplaması yapılmıyor.
   * Sadece koç değerlendirmesine küçük katkı sağlıyor.
   */

  if (input.obp >= 90) {
    probability += 4;
  } else if (input.obp >= 80) {
    probability += 3;
  } else if (input.obp >= 70) {
    probability += 2;
  } else if (input.obp >= 60) {
    probability += 1;
  }

  const recommendedDailyHours =
    getRecommendedHours(input.targetRanking);

  /*
   * Öğrenci önerilen günlük çalışma süresini
   * karşılıyorsa küçük bir çalışma disiplini
   * bonusu veriyoruz.
   */

  if (
    input.studyHours >= recommendedDailyHours
  ) {
    probability += 5;
  }

  /*
   * Haftalık çalışma düzeni.
   */

  if (input.studyDays >= 6) {
    probability += 3;
  } else if (input.studyDays >= 5) {
    probability += 2;
  } else if (input.studyDays >= 4) {
    probability += 1;
  }

  probability = Math.max(
    5,
    Math.min(99, probability)
  );

  let risk: "LOW" | "MEDIUM" | "HIGH" =
    "HIGH";

  if (probability >= 80) {
    risk = "LOW";
  } else if (probability >= 55) {
    risk = "MEDIUM";
  }

  const weakLessons: string[] = [];
  const strongLessons: string[] = [];

  /*
   * TYT ve AYT hedefleri artık ayrı
   * değerlendiriliyor.
   */

  if (input.currentTYT < target.tyt) {
    weakLessons.push("TYT");
  } else {
    strongLessons.push("TYT");
  }

  if (input.currentAYT < target.ayt) {
    weakLessons.push("AYT");
  } else {
    strongLessons.push("AYT");
  }

  const todayTasks: DailyTask[] = [];

  /*
   * TYT hedefinin gerisindeyse
   */

  if (weakLessons.includes("TYT")) {
    todayTasks.push({
      title: "TYT Matematik Çalışması",
      duration: 60,
    });

    todayTasks.push({
      title: "Paragraf Çalışması",
      duration: 40,
    });
  }

  /*
   * AYT hedefinin gerisindeyse
   */

  if (weakLessons.includes("AYT")) {
    todayTasks.push({
      title: "AYT Branş Çalışması",
      duration: 75,
    });
  }

  /*
   * Deneme analizi herkese önerilir.
   */

  todayTasks.push({
    title: "Deneme Analizi",
    duration: 30,
  });

  /*
   * Hedef net farkları.
   */

  const tytDifference = Number(
    (target.tyt - input.currentTYT).toFixed(1)
  );

  const aytDifference = Number(
    (target.ayt - input.currentAYT).toFixed(1)
  );

  let coachMessage = "";

  if (
    tytDifference <= 0 &&
    aytDifference <= 0
  ) {
    coachMessage =
      "TYT ve AYT netlerin mevcut hedef seviyenin üzerinde. Performansını koruyup deneme istikrarına odaklan.";
  } else if (probability >= 80) {
    coachMessage =
      "Hedefine oldukça yakınsın. Eksik olduğun TYT veya AYT alanlarına odaklanarak mevcut tempoyu koru.";
  } else if (probability >= 55) {
    coachMessage =
      "Hedefin ulaşılabilir görünüyor. Net açığını düzenli konu çalışması, soru çözümü ve deneme analiziyle kapatabilirsin.";
  } else {
    coachMessage =
      "Mevcut TYT ve AYT netlerin hedef seviyenin altında. Öncelikle temel eksikleri kapatıp düzenli net artışına odaklanmalısın.";
  }

  return {
    targetProbability: probability,

    risk,

    targetTYT: target.tyt,
    targetAYT: target.ayt,

    recommendedDailyHours,

    weakLessons,
    strongLessons,

    todayTasks,

    coachMessage,
  };
}

/*
 * StudyPlannerPage tarafından kullanılan
 * öneri modeli.
 */

export interface Recommendation {
  id: string;

  subject: string;
  topic?: string;

  reason: string;

  priority:
    | "Yüksek"
    | "Orta"
    | "Düşük";

  type:
    | "study"
    | "revision"
    | "exam"
    | "motivation";

  estimatedMinutes: number;

  difficulty:
    | "Kolay"
    | "Orta"
    | "Zor";

  motivationSentence: string;
}

/*
 * StudyPlannerPage şu anda bu fonksiyonu:
 *
 * generateRecommendations(
 *   exams,
 *   progressMap,
 *   subjects
 * )
 *
 * şeklinde çağırıyor.
 *
 * Bu nedenle eski CoachReport parametreli
 * fonksiyon burada kullanılmıyor.
 */

export function generateRecommendations(
  exams: any[] = [],
  progressMap: Record<string, any> = {},
  subjects: any[] = []
): Recommendation[] {
  const recommendations: Recommendation[] =
    [];

  /*
   * ─────────────────────────────────────
   * KONU İLERLEME ÖNERİLERİ
   * ─────────────────────────────────────
   */

  for (const subject of subjects) {
    const subjectProgress =
      progressMap?.[subject.id] ?? {};

    const topics = Array.isArray(
      subject.topics
    )
      ? subject.topics
      : [];

    /*
     * Tekrar edilmesi gereken konu.
     */

    const revisionTopic = topics.find(
      (topic: any) =>
        subjectProgress?.[topic.id] ===
        "Tekrar Edilecek"
    );

    if (revisionTopic) {
      recommendations.push({
        id: `revision-${subject.id}-${revisionTopic.id}`,

        subject: subject.name,

        topic: revisionTopic.name,

        reason:
          "Bu konuyu daha önce çalıştın ancak tekrar edilmesi gerekiyor.",

        priority: "Yüksek",

        type: "revision",

        estimatedMinutes: 30,

        difficulty: "Orta",

        motivationSentence:
          "Kısa bir tekrar, unutulan bilgileri hızla geri getirir.",
      });
    }

    /*
     * Henüz başlanmamış ilk konu.
     */

    const newTopic = topics.find(
      (topic: any) => {
        const status =
          subjectProgress?.[topic.id];

        return (
          !status ||
          status === "Başlanmadı"
        );
      }
    );

    if (newTopic) {
      recommendations.push({
        id: `study-${subject.id}-${newTopic.id}`,

        subject: subject.name,

        topic: newTopic.name,

        reason:
          "Müfredat ilerlemeni artırmak için sıradaki çalışılmamış konuya başlayabilirsin.",

        priority: "Yüksek",

        type: "study",

        estimatedMinutes: 60,

        difficulty: "Orta",

        motivationSentence:
          "Her tamamlanan konu seni hedef sıralamana biraz daha yaklaştırır.",
      });
    }
  }

  /*
   * ─────────────────────────────────────
   * DENEME ÖNERİSİ
   * ─────────────────────────────────────
   */

  if (exams.length === 0) {
    recommendations.push({
      id: "exam-first",

      subject: "Deneme",

      topic: "Seviye Tespit Denemesi",

      reason:
        "Henüz kayıtlı deneme sonucu bulunmuyor. Mevcut seviyeni görebilmek için bir deneme sonucu ekle.",

      priority: "Yüksek",

      type: "exam",

      estimatedMinutes: 0,

      difficulty: "Orta",

      motivationSentence:
        "Ölçemediğin gelişimi yönetemezsin.",
    });
  } else {
    recommendations.push({
      id: "exam-analysis",

      subject: "Deneme",

      topic: "Son Deneme Analizi",

      reason:
        "Son denemendeki yanlış ve boş soruları inceleyerek konu eksiklerini belirle.",

      priority: "Orta",

      type: "exam",

      estimatedMinutes: 30,

      difficulty: "Orta",

      motivationSentence:
        "Net artışının en hızlı yollarından biri doğru deneme analizidir.",
    });
  }

  /*
   * ─────────────────────────────────────
   * MOTİVASYON
   * ─────────────────────────────────────
   */

  recommendations.push({
    id: "motivation-consistency",

    subject: "Çalışma Düzeni",

    reason:
      "Kısa süreli yoğun çalışmadan çok sürdürülebilir çalışma düzenine odaklan.",

    priority: "Düşük",

    type: "motivation",

    estimatedMinutes: 0,

    difficulty: "Kolay",

    motivationSentence:
      "İstikrar, tek günlük yüksek performanstan daha değerlidir.",
  });

  /*
   * Sayfanın gereksiz yere onlarca
   * kart göstermesini engelliyoruz.
   */

  return recommendations.slice(0, 12);
}