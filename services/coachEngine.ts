import { UserProfile } from "@/types/user";
import { ExamResult } from "@/types/exam";

export interface CoachTask {
  title: string;
  duration: number;
}

export interface CoachReport {
  targetProbability: number;
  risk: string;

  targetTYT: number;
  targetAYT: number;

  currentTYT: number;
  currentAYT: number;

  currentTotal: number;
  targetTotal: number;

  weeklyNetIncrease: number;
  dailyQuestionTarget: number;

  studyRecommendation: number;

  strongestLesson?: string;
  weakestLesson?: string;

  todayTasks: CoachTask[];

  coachMessage: string;
}

export function calculateOBP(diplomaNotu: number): number {
  return diplomaNotu * 5;
}

export function calculateRequiredDailyStudy(
  targetNet: number,
  currentNet: number,
  daysLeft: number
): number {
  if (daysLeft <= 0) return 0;

  const remainingNet = Math.max(targetNet - currentNet, 0);

  return Number(((remainingNet / daysLeft) * 2).toFixed(1));
}

export function calculateWeeklyGoal(
  targetNet: number,
  currentNet: number,
  weeksLeft: number
): number {
  if (weeksLeft <= 0) return 0;

  return Number(((targetNet - currentNet) / weeksLeft).toFixed(2));
}

export function calculateTargetProgress(
  currentNet: number,
  targetNet: number
): number {
  if (targetNet <= 0) return 0;

  return Math.min(
    100,
    Math.round((currentNet / targetNet) * 100)
  );
}

export function calculateWeakLessons(
  lessons: { lesson: string; net: number }[]
) {
  return [...lessons]
    .sort((a, b) => a.net - b.net)
    .slice(0, 3);
}

export function estimateExamScore(
  tyt: number,
  ayt: number,
  obp: number
): number {
  return Math.round(
    tyt * 3 +
      ayt * 3 +
      obp * 0.12
  );
}

function lessonAverages(exams: ExamResult[]) {
  if (!exams.length) {
    return {
      strongest: "",
      weakest: "",
    };
  }

  const lessons = [
    {
      lesson: "TYT Matematik",
      net:
        exams.reduce(
          (a, e) => a + Number(e.tytMat || 0),
          0
        ) / exams.length,
    },
    {
      lesson: "TYT Türkçe",
      net:
        exams.reduce(
          (a, e) => a + Number(e.tytTurkce || 0),
          0
        ) / exams.length,
    },
    {
      lesson: "TYT Fen",
      net:
        exams.reduce(
          (a, e) => a + Number(e.tytFen || 0),
          0
        ) / exams.length,
    },
    {
      lesson: "TYT Sosyal",
      net:
        exams.reduce(
          (a, e) => a + Number(e.tytSosyal || 0),
          0
        ) / exams.length,
    },
  ];

  lessons.sort((a, b) => b.net - a.net);

  return {
    strongest: lessons[0].lesson,
    weakest: lessons[lessons.length - 1].lesson,
  };
}

export function generateDailyTasks(user: UserProfile): CoachTask[] {
  const tasks: CoachTask[] = [];

  tasks.push({
    title: "TYT Matematik Soru Çözümü",
    duration: 60,
  });

  tasks.push({
    title: "Paragraf Çalışması",
    duration: 40,
  });

  if (user.alan === "Sayısal") {
    tasks.push({
      title: "AYT Fen Tekrarı",
      duration: 90,
    });
  } else if (user.alan === "Eşit Ağırlık") {
    tasks.push({
      title: "AYT Edebiyat",
      duration: 75,
    });
  } else if (user.alan === "Sözel") {
    tasks.push({
      title: "Tarih - Coğrafya Tekrarı",
      duration: 90,
    });
  } else {
    tasks.push({
      title: "YDT Kelime Çalışması",
      duration: 60,
    });
  }

  return tasks;
}

export function generateCoachReport(
  user: UserProfile,
  exams: ExamResult[]
): CoachReport {
  const currentTYT =
    user.currentTYT ??
    (exams.length ? exams[exams.length - 1].tytToplamNet : 0);

  const currentAYT =
    user.currentAYT ??
    (exams.length ? exams[exams.length - 1].aytToplamNet : 0);

  let targetTYT = 85;
  let targetAYT = 55;

  const rank = Number(user.hedefSiralama || 100000);

  if (rank <= 5000) {
    targetTYT = 105;
    targetAYT = 75;
  } else if (rank <= 10000) {
    targetTYT = 100;
    targetAYT = 72;
  } else if (rank <= 30000) {
    targetTYT = 95;
    targetAYT = 68;
  } else if (rank <= 50000) {
    targetTYT = 90;
    targetAYT = 63;
  }

  const currentTotal = currentTYT + currentAYT;
  const targetTotal = targetTYT + targetAYT;

  const probability = Math.min(
    100,
    Math.round((currentTotal / targetTotal) * 100)
  );

  let risk = "Düşük";

  if (probability < 40) risk = "Yüksek";
  else if (probability < 70) risk = "Orta";

  const lessonInfo = lessonAverages(exams);

  const studyHours = user.studyHours || 3;

  const dailyQuestionTarget =
    studyHours >= 6
      ? 300
      : studyHours >= 5
      ? 250
      : studyHours >= 4
      ? 200
      : studyHours >= 3
      ? 150
      : 100;

  const weeklyNetIncrease = Number(
    ((targetTotal - currentTotal) / 40).toFixed(2)
  );

  let coachMessage = "";

  if (probability >= 80) {
    coachMessage =
      "Hedefin oldukça yakınında. Mevcut çalışma düzenini koruyarak deneme analizlerine ağırlık vermelisin.";
  } else if (probability >= 60) {
    coachMessage =
      `En güçlü dersin ${lessonInfo.strongest}. ${lessonInfo.weakest} dersine biraz daha zaman ayırırsan hedefe ulaşma ihtimalin ciddi şekilde artacaktır.`;
  } else {
    coachMessage =
      `Şu an hedefinden uzaktasın. Özellikle ${lessonInfo.weakest} dersini güçlendirmeli ve haftalık çalışma süreni artırmalısın.`;
  }

  return {
    targetProbability: probability,
    risk,

    targetTYT,
    targetAYT,

    currentTYT,
    currentAYT,

    currentTotal,
    targetTotal,

    weeklyNetIncrease,

    dailyQuestionTarget,

    studyRecommendation: studyHours,

    strongestLesson: lessonInfo.strongest,
    weakestLesson: lessonInfo.weakest,

    todayTasks: generateDailyTasks(user),

    coachMessage,
  };
}