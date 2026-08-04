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

export interface Recommendation {
  id: string;
  subject: string;
  topic?: string;

  priority: "Yüksek" | "Orta" | "Düşük";

  type: "study" | "revision" | "exam" | "motivation";

  estimatedMinutes: number;

  difficulty: string;

  reason: string;

  motivationSentence: string;
}

function getTargetNet(ranking: number, alan: string) {
  if (alan === "Sayısal") {
    if (ranking <= 1000) return { tyt: 110, ayt: 74 };
    if (ranking <= 5000) return { tyt: 104, ayt: 69 };
    if (ranking <= 10000) return { tyt: 99, ayt: 64 };
    if (ranking <= 30000) return { tyt: 92, ayt: 58 };
    if (ranking <= 60000) return { tyt: 86, ayt: 52 };
    if (ranking <= 100000) return { tyt: 80, ayt: 46 };

    return { tyt: 74, ayt: 40 };
  }

  if (alan === "Eşit Ağırlık") {
    if (ranking <= 5000) return { tyt: 95, ayt: 60 };
    if (ranking <= 20000) return { tyt: 88, ayt: 52 };

    return { tyt: 80, ayt: 45 };
  }

  if (alan === "Sözel") {
    return { tyt: 82, ayt: 60 };
  }

  return {
    tyt: 80,
    ayt: 65,
  };
}

function getRecommendedHours(rank: number) {
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
  const target = getTargetNet(
    input.targetRanking,
    input.alan
  );

  const current =
    input.currentTYT +
    input.currentAYT;

  const goal =
    target.tyt +
    target.ayt;

  let probability = Math.round(
    (current / goal) * 100
  );

  probability += Math.floor(
    input.obp / 100
  );

  if (
    input.studyHours >=
    getRecommendedHours(
      input.targetRanking
    )
  ) {
    probability += 10;
  }

  probability = Math.max(
    5,
    Math.min(99, probability)
  );

  let risk:
    | "LOW"
    | "MEDIUM"
    | "HIGH" = "HIGH";

  if (probability >= 80)
    risk = "LOW";
  else if (probability >= 55)
    risk = "MEDIUM";

  const weakLessons: string[] = [];
  const strongLessons: string[] = [];

  if (
    input.currentTYT <
    target.tyt
  ) {
    weakLessons.push("TYT");
  } else {
    strongLessons.push("TYT");
  }

  if (
    input.currentAYT <
    target.ayt
  ) {
    weakLessons.push("AYT");
  } else {
    strongLessons.push("AYT");
  }

  const todayTasks: DailyTask[] = [];

  if (
    weakLessons.includes("TYT")
  ) {
    todayTasks.push({
      title:
        "40 TYT Matematik",
      duration: 60,
    });

    todayTasks.push({
      title:
        "30 Paragraf",
      duration: 40,
    });
  }

  if (
    weakLessons.includes("AYT")
  ) {
    todayTasks.push({
      title:
        "AYT Branş Çalışması",
      duration: 75,
    });
  }

  todayTasks.push({
    title: "Deneme Analizi",
    duration: 30,
  });
    let coachMessage = "";

  if (probability >= 80) {
    coachMessage =
      "Hedefin için doğru yoldasın. Tempoyu koru.";
  } else if (probability >= 55) {
    coachMessage =
      "Hedefin ulaşılabilir. Düzenli çalışmaya devam et.";
  } else {
    coachMessage =
      "Çalışma planını artırmalısın. Hedef için daha fazla net gerekiyor.";
  }

  return {
    targetProbability: probability,

    risk,

    targetTYT: target.tyt,

    targetAYT: target.ayt,

    recommendedDailyHours:
      getRecommendedHours(
        input.targetRanking
      ),

    weakLessons,

    strongLessons,

    todayTasks,

    coachMessage,
  };
}

/* =======================================================
   StudyPlannerPage için yeni öneri sistemi
======================================================= */

export function generateRecommendations(
  exams: any[],
  progressMap: any,
  subjects: any[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const subject of subjects) {
    const subjectProgress =
      progressMap?.[subject.id] ?? {};

    for (const topic of subject.topics) {
      const status =
        subjectProgress?.[topic.id];

      if (
        status === "Tekrar Edilecek"
      ) {
        recommendations.push({
          id:
            subject.id +
            "-" +
            topic.id +
            "-review",

          subject: subject.name,

          topic: topic.name,

          priority: "Yüksek",

          type: "revision",

          estimatedMinutes: 30,

          difficulty: "Kolay",

          reason:
            "Bu konu tekrar bekliyor.",

          motivationSentence:
            "Tekrar edilen bilgiler kalıcı olur.",
        });
      }

      if (
        status === "Çalışılıyor"
      ) {
        recommendations.push({
          id:
            subject.id +
            "-" +
            topic.id +
            "-study",

          subject: subject.name,

          topic: topic.name,

          priority: "Orta",

          type: "study",

          estimatedMinutes: 45,

          difficulty: "Orta",

          reason:
            "Bu konu üzerinde çalışmaya devam etmelisin.",

          motivationSentence:
            "Düzenli tekrar başarı getirir.",
        });
      }

      if (
        !status ||
        status === "Başlanmadı"
      ) {
        recommendations.push({
          id:
            subject.id +
            "-" +
            topic.id +
            "-new",

          subject: subject.name,

          topic: topic.name,

          priority: "Orta",

          type: "study",

          estimatedMinutes: 50,

          difficulty: "Orta",

          reason:
            "Henüz başlanmamış konu.",

          motivationSentence:
            "İlk adımı bugün at.",
        });
      }
    }
  }
    if (Array.isArray(exams) && exams.length > 0) {
    recommendations.push({
      id: "exam-analysis",

      subject: "Genel",

      priority: "Yüksek",

      type: "exam",

      estimatedMinutes: 40,

      difficulty: "Kolay",

      reason:
        "Son çözdüğün denemelerin analizini yap.",

      motivationSentence:
        "Deneme analizi net artırmanın en etkili yollarından biridir.",
    });
  }

  recommendations.push({
    id: "daily-plan",

    subject: "Genel",

    priority: "Düşük",

    type: "motivation",

    estimatedMinutes: 10,

    difficulty: "Kolay",

    reason:
      "Bugünkü çalışma düzenini koru.",

    motivationSentence:
      "İstikrarlı çalışma uzun vadede büyük fark oluşturur.",
  });

  const unique = new Map<string, Recommendation>();

  for (const item of recommendations) {
    if (!unique.has(item.id)) {
      unique.set(item.id, item);
    }
  }

  return Array.from(unique.values()).sort((a, b) => {
    const order = {
      "Yüksek": 0,
      "Orta": 1,
      "Düşük": 2,
    };

    return order[a.priority] - order[b.priority];
  });
}