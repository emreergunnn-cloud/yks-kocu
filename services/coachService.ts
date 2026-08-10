import { calculateTarget } from "./rankingService";

export interface CoachInput {
  alan: string;
  targetRanking: number;
  currentTYT: number;
  currentAYT: number;
}

export interface CoachTask {
  title: string;
  duration: number;
}

export interface CoachReport {
  targetProbability: number;
  risk: string;
  targetTYT: number;
  targetAYT: number;
  todayTasks: CoachTask[];
}

export interface Recommendation {
  id: string;

  type:
    | "study"
    | "revision"
    | "exam"
    | "motivation";

  subject: string;
  topic: string;

  priority:
    | "Yüksek"
    | "Orta"
    | "Düşük";

  reason: string;
  motivationSentence: string;

  estimatedMinutes: number;

  difficulty:
    | "Kolay"
    | "Orta"
    | "Zor";

  title?: string;
  description?: string;
  duration?: number;
}

/**
 * Öğrencinin mevcut performansına göre
 * hedefe ulaşma durumunu analiz eder.
 */
export function generateCoachReport(
  input: CoachInput
): CoachReport {
  const target = calculateTarget(
    input.alan,
    input.targetRanking,
    2026
  );

  const tytProgress =
    target.tytNet > 0
      ? input.currentTYT / target.tytNet
      : 0;

  const aytProgress =
    target.aytNet > 0
      ? input.currentAYT / target.aytNet
      : 0;

  const progress =
    tytProgress * 0.4 +
    aytProgress * 0.6;

  const targetProbability = Math.round(
    Math.max(
      0,
      Math.min(99, progress * 100)
    )
  );

  let risk = "Yüksek";

  if (progress >= 1) {
    risk = "Düşük";
  } else if (progress >= 0.8) {
    risk = "Orta";
  }

  const todayTasks: CoachTask[] = [];

  if (input.currentTYT < target.tytNet) {
    todayTasks.push({
      title: "TYT eksik konularına odaklan",
      duration: 60,
    });
  }

  if (input.currentAYT < target.aytNet) {
    todayTasks.push({
      title: "AYT eksik konularına odaklan",
      duration: 90,
    });
  }

  if (todayTasks.length === 0) {
    todayTasks.push({
      title: "Tam kapsamlı deneme çöz",
      duration: 120,
    });
  }

  return {
    targetProbability,
    risk,
    targetTYT: target.tytNet,
    targetAYT: target.aytNet,
    todayTasks,
  };
}

/**
 * Eski kullanım için alias.
 */
export function calculateCoachReport(
  input: CoachInput
): CoachReport {
  return generateCoachReport(input);
}

/**
 * Öğrenci için çalışma önerileri oluşturur.
 */
export function generateRecommendations(
  exams: any[],
  progressMap: any,
  subjects: any[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  /**
   * Hiç deneme yoksa.
   */
  if (!exams || exams.length === 0) {
    recommendations.push({
      id: "first-exam",
      type: "exam",
      subject: "Genel",
      topic: "Deneme Sınavı",
      priority: "Yüksek",
      reason:
        "Performansını analiz edebilmek için henüz yeterli deneme verisi bulunmuyor.",
      motivationSentence:
        "İlk denemeni çözerek gelişim yolculuğunu başlat!",
      estimatedMinutes: 120,
      difficulty: "Orta",
      title: "İlk denemeni çöz",
      description:
        "Performansını analiz edebilmek için bir deneme sınavı ekle.",
      duration: 120,
    });

    return recommendations;
  }

  /**
   * Konu ilerlemesini analiz et.
   */
  let totalTopics = 0;
  let completedTopics = 0;

  if (subjects && progressMap) {
    subjects.forEach((subject: any) => {
      const topics = subject.topics || [];

      topics.forEach((topic: any) => {
        totalTopics++;

        const status =
          progressMap[subject.id]?.[topic.id];

        if (
          status === "Tamamlandı" ||
          status === "completed"
        ) {
          completedTopics++;
        }
      });
    });
  }

  /**
   * Konuların yarısından azı tamamlandıysa
   * tekrar öner.
   */
  if (
    totalTopics > 0 &&
    completedTopics / totalTopics < 0.5
  ) {
    recommendations.push({
      id: "topic-completion",
      type: "revision",
      subject: "Genel",
      topic: "Eksik Konular",
      priority: "Yüksek",
      reason:
        "Müfredatındaki tamamlanmamış konu sayısı oldukça fazla.",
      motivationSentence:
        "Eksiklerini kapattıkça netlerin çok daha hızlı yükselecek!",
      estimatedMinutes: 60,
      difficulty: "Orta",
      title: "Konu eksiklerini tamamla",
      description:
        "Müfredatındaki tamamlanmamış konulara odaklanarak temel eksiklerini kapat.",
      duration: 60,
    });
  }

  /**
   * Son denemedeki performansı kontrol et.
   */
  const latestExam = exams[0];

  if (latestExam) {
    const tytNet = Number(
      latestExam.tytNet ??
        latestExam.tyt ??
        0
    );

    const aytNet = Number(
      latestExam.aytNet ??
        latestExam.ayt ??
        0
    );

    /**
     * TYT düşükse.
     */
    if (tytNet > 0 && tytNet < 80) {
      recommendations.push({
        id: "tyt-improvement",
        type: "study",
        subject: "TYT",
        topic: "TYT Net Geliştirme",
        priority: "Yüksek",
        reason:
          `Son denemendeki TYT netin ${tytNet}. Bu seviyeyi yükseltmek için düzenli soru çözümü gerekiyor.`,
        motivationSentence:
          "TYT'de birkaç netlik artış bile sıralamada büyük fark yaratabilir!",
        estimatedMinutes: 60,
        difficulty: "Orta",
        title: "TYT netlerini yükselt",
        description:
          "TYT temel derslerinde düzenli soru çözümü ve deneme çalışması yap.",
        duration: 60,
      });
    }

    /**
     * AYT düşükse.
     */
    if (aytNet > 0 && aytNet < 50) {
      recommendations.push({
        id: "ayt-improvement",
        type: "study",
        subject: "AYT",
        topic: "AYT Net Geliştirme",
        priority: "Yüksek",
        reason:
          `Son denemendeki AYT netin ${aytNet}. AYT çalışmalarına daha fazla ağırlık vermen gerekiyor.`,
        motivationSentence:
          "AYT netlerini yükseltmek hedef sıralamana ulaşmanda en büyük kaldıraçlardan biri!",
        estimatedMinutes: 90,
        difficulty: "Zor",
        title: "AYT çalışmalarını güçlendir",
        description:
          "AYT derslerinde konu tekrarı ve yoğun soru çözümüne ağırlık ver.",
        duration: 90,
      });
    }
  }

  /**
   * Hiç özel öneri oluşmadıysa motivasyon önerisi.
   */
  if (recommendations.length === 0) {
    recommendations.push({
      id: "regular-exam",
      type: "motivation",
      subject: "Genel",
      topic: "Düzenli Çalışma",
      priority: "Orta",
      reason:
        "Mevcut performansında kritik bir eksik görünmüyor.",
      motivationSentence:
        "Düzenli çalışmaya devam et ve hedefinin üzerine çık!",
      estimatedMinutes: 120,
      difficulty: "Orta",
      title: "Düzenli çalışmaya devam et",
      description:
        "Performansını korumak ve gelişimini sürdürmek için düzenli çalış.",
      duration: 120,
    });
  }

  return recommendations;
}