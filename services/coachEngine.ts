import { UserProfile } from "@/types/user";
import { ExamResult } from "@/types/exam";
import { SubjectProgressMap } from "./topicService";
import { StreakData } from "./streakService";
import { getAllMasteries, MasteryResult } from "./masteryEngine";
import { YKS_SUBJECTS } from "@/lib/constants/subjects";
import { APP_CONFIG } from "@/lib/constants/config";

export interface CoachTask {
  title: string;
  duration: number;
  subject?: string;
  topic?: string;
  subjectId?: string;
  topicId?: string;
  taskId?: string;
  reason?: string;
  priority?: "low" | "medium" | "high";
  estimatedMinutes?: number;
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

function getDaysToYKS(): number {
  const targetDate = new Date(APP_CONFIG.YKS_DATE).getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;
  if (diff <= 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function findWeakestLessons(exams: ExamResult[]) {
  if (!exams.length) {
    return [];
  }

  const lessons = [
    {
      id: "tyt_matematik",
      lesson: "TYT Matematik",
      net: exams.reduce((a, e) => a + Number(e.tytMat || 0), 0) / exams.length,
    },
    {
      id: "tyt_turkce",
      lesson: "TYT Türkçe",
      net: exams.reduce((a, e) => a + Number(e.tytTurkce || 0), 0) / exams.length,
    },
    {
      id: "tyt_fen",
      lesson: "TYT Fen",
      net: exams.reduce((a, e) => a + Number(e.tytFen || 0), 0) / exams.length,
    },
    {
      id: "tyt_sosyal",
      lesson: "TYT Sosyal",
      net: exams.reduce((a, e) => a + Number(e.tytSosyal || 0), 0) / exams.length,
    },
  ];

  lessons.sort((a, b) => a.net - b.net);
  return lessons; // ascending (weakest first)
}

function generateDynamicTasks(
  user: UserProfile,
  exams: ExamResult[],
  progressMap: SubjectProgressMap,
  targetTYT: number,
  targetAYT: number,
  daysToYKS: number,
  streak: StreakData | null = null,
  todayStudySessions: any[] = [],
  masteries: Record<string, MasteryResult> = {}
): CoachTask[] {
  const tasks: CoachTask[] = [];

  const studiedTopicIds = new Set(
    todayStudySessions.map(s => s.topicId).filter(Boolean)
  );

  if (exams.length === 0) {
    tasks.push({
      title: "Seviye Belirleme Denemesi Çöz",
      subject: "Genel",
      reason: "Henüz hiç deneme çözmemişsin. Seviyeni belirleyip kişisel bir program çıkartabilmem için ilk denemeni çözmelisin.",
      priority: "high",
      duration: 135,
      estimatedMinutes: 135,
    });
    return tasks;
  }

  const currentTotal = exams[exams.length - 1].tytToplamNet || 0;
  const targetTotal = targetTYT + targetAYT;
  const gap = targetTotal - currentTotal;
  
  const trend = checkExamTrend(exams);
  const trendMsg = trend.dropping ? `Son denemende netin ${trend.dropAmount.toFixed(1)} düştü. ` : "";
  const streakMsg = (streak && streak.currentStreak >= 3) ? ` ${streak.currentStreak} günlük çalışma serini korumak için bugünkü görevi tamamla.` : "";
  const gapMsg = gap > 0 ? `Hedefinin ${gap.toFixed(1)} net gerisindesin.` : `Hedefine ulaşmış durumdasın.`;

  if (gap <= 5) {
    tasks.push({
      title: "Hız ve Süre Yönetimi Pratiği",
      reason: `${gapMsg} Artık temel konulardan ziyade süre tutarak branş denemeleri veya seri soru çözümleri yapmalısın.${streakMsg}`,
      priority: "medium",
      duration: 60,
      estimatedMinutes: 60,
    });
    return tasks;
  }

  const weakLessons = findWeakestLessons(exams);
  
  if (weakLessons.length > 0) {
    let topicFound = false;

    // Weak Topic History
    const lastNExams = exams.slice(-5);
    const weakTopicCounts: Record<string, number> = {};
    const lastExamWeakTopics = new Set<string>();

    if (lastNExams.length > 0) {
      const lastExam = lastNExams[lastNExams.length - 1];
      (lastExam.weakTopics || []).forEach(t => lastExamWeakTopics.add(t));
      
      lastNExams.forEach(ex => {
        (ex.weakTopics || []).forEach(t => {
          weakTopicCounts[t] = (weakTopicCounts[t] || 0) + 1;
        });
      });
    }
    
    for (const w of weakLessons) {
      if (topicFound) break;
      
      const subject = YKS_SUBJECTS.find((s) => s.id === w.id);
      if (!subject) continue;
      
      const subProg = progressMap[subject.id] || {};
      
      const isAvailable = (t: any) => !studiedTopicIds.has(t.id);
      const availableTopics = subject.topics.filter(isAvailable);
      
      let bestTopic = null;
      let highestPriority = -1;
      let bestReason = "";

      for (const t of availableTopics) {
        const m = masteries[t.id];
        const mScore = m ? m.score : 0;
        const weakCount = weakTopicCounts[t.id] || 0;
        const prog = subProg[t.id];

        let priority = 0;
        let reason = "";

        if (prog !== "Tamamlandı" && weakCount >= 2 && mScore < 45) {
          priority = 100 - mScore; // HIGH
          reason = `Konu gücün şu anda ${mScore}/100 seviyesinde. Son denemelerde sürekli zorlandığın için bu konuya öncelik vermeliyiz.`;
        } else if (prog === "Tamamlandı" && weakCount >= 2 && mScore < 45) {
          priority = 90 - mScore; // HIGH
          reason = `Konu ilerlemende tamamlandı görünse de konu gücün ${mScore}/100 ve son denemelerde tekrar hata yaptın. Kısa bir tekrar uygun görünüyor.`;
        } else if (weakCount > 0 && mScore < 45) {
          priority = 80 - mScore; // HIGH/MEDIUM
          reason = `Konu gücün ${mScore}/100 seviyesinde. Denemelerdeki açığını kapatmak için pratik yapmalısın.`;
        } else if (mScore >= 45 && mScore <= 64 && weakCount > 0) {
          priority = 60 - (mScore - 45); // MEDIUM
          reason = `Konu gücün orta seviyede (${mScore}/100) ama denemelerde zaman zaman hata yapıyorsun. Pratikle pekiştirmelisin.`;
        } else if (prog === "Tekrar Edilecek") {
          priority = 50 - mScore; // MEDIUM
          reason = `Konu tekrar bekliyor ve konu gücün ${mScore}/100. Unutmamak için tekrar yapmalısın.`;
        } else if (prog === "Çalışılıyor") {
          priority = 40; // MEDIUM
          reason = `Bu konuya çalışmaya devam ediyorsun (Konu Gücü: ${mScore}/100).`;
        } else if (!prog) {
          priority = 30; // STARTING
          reason = `Bu konuya henüz başlamadın.`;
        } else if (mScore > 64 && weakCount === 0) {
          priority = 10; // LOW
          reason = `Konu gücün yüksek (${mScore}/100). Rutin pratik yeterli.`;
        }

        if (priority > highestPriority) {
          highestPriority = priority;
          bestTopic = t;
          bestReason = reason;
        }
      }

      let selectedTopic = null;
      let selectionReason = "";

      if (highestPriority > 30) {
        selectedTopic = bestTopic;
        selectionReason = bestReason;
      } else if (bestTopic && daysToYKS > 180) {
        // Bol vakit varsa yeni konuya başla
        selectedTopic = bestTopic;
        selectionReason = bestReason;
      } else if (bestTopic && highestPriority === 30 && gap > 20) {
         selectedTopic = bestTopic;
         selectionReason = bestReason;
      }

      const priorityTopic = selectedTopic;

      if (priorityTopic) {
        let addedTask: CoachTask | null = null;
        const taskBase = {
          subject: subject.name,
          subjectId: subject.id,
          topic: priorityTopic.name,
          topicId: priorityTopic.id,
          taskId: `${subject.id}-${priorityTopic.id}-${Date.now()}`
        };

        // AI Koç Countdown Davranışı
        if (daysToYKS < 30) {
          addedTask = {
            ...taskBase,
            title: `${subject.name} - Yanlış Analizi ve Nokta Atışı Tekrar`,
            topic: "Genel Tekrar", // override
            reason: `${trendMsg}YKS'ye ${daysToYKS} gün kaldı, önceliğimiz ${subject.name}. ${selectionReason} Bu açığı yeni konu öğrenmek yerine nokta atışı tekrarla kapatmalısın.${streakMsg}`,
            priority: "high",
            duration: 45,
            estimatedMinutes: 45,
          };
        } else if (daysToYKS <= 90) {
          addedTask = {
            ...taskBase,
            title: `${priorityTopic.name} Yoğun Pratik ve Branş Denemesi`,
            reason: `${gapMsg} ${trendMsg}${subject.name} zayıf halkan. ${selectionReason} Sınava yaklaşıyoruz, bu konuyu hızla kapatmalısın.${streakMsg}`,
            priority: "high",
            duration: 60,
            estimatedMinutes: 60,
          };
        } else if (daysToYKS <= 180) {
          addedTask = {
            ...taskBase,
            title: `${priorityTopic.name} Konu Kapatma ve Soru Çözümü`,
            reason: `${gapMsg} ${trendMsg}${subject.name} dersi hedefin için kritik. ${selectionReason} YKS'ye ${daysToYKS} gün kala bu eksiği güvence altına almalısın.${streakMsg}`,
            priority: "high",
            duration: 60,
            estimatedMinutes: 60,
          };
        } else {
          // > 180 gün (Temel oluşturma)
          if (gap > 20) {
            addedTask = {
              ...taskBase,
              title: `${priorityTopic.name} Temel Konu Öğrenimi`,
              reason: `${gapMsg} Sınava bolca vaktimiz var. ${subject.name} dersinde temel atarak başlaman çok önemli. ${selectionReason}${streakMsg}`,
              priority: "high",
              duration: 90,
              estimatedMinutes: 90,
            };
          } else {
            addedTask = {
              ...taskBase,
              title: `${priorityTopic.name} Konu Öğrenimi ve Pratik`,
              reason: `${gapMsg} ${subject.name} netlerini yukarı çekmelisin. ${selectionReason}${streakMsg}`,
              priority: "medium",
              duration: 60,
              estimatedMinutes: 60,
            };
          }
        }
        
        if (addedTask) {
          tasks.push(addedTask);
          if (tasks.length >= 2) {
             topicFound = true; // max 2 ders için zayıf konu bulur
          }
        }
      }
    }
    
    if (tasks.length === 0) {
      if (daysToYKS < 30) {
        tasks.push({
          title: "Genel TYT/AYT Deneme Kampı",
          reason: `${trendMsg}Sınava sadece ${daysToYKS} gün kaldı! Bugün için belirgin bir konu eksiğin kalmadı, sürekli deneme çözüp süre ve strateji pratiği yapmalısın.${streakMsg}`,
          priority: "high",
          duration: 135,
          estimatedMinutes: 135,
        });
      } else {
        tasks.push({
          title: "Genel Soru Çözümü ve Branş Denemesi",
          reason: `${gapMsg} Bugün için belirgin bir konu eksiğin kalmadı. Bol pratik yaparak netlerini artırmalısın.${streakMsg}`,
          priority: "medium",
          duration: 50,
          estimatedMinutes: 50,
        });
      }
    }
  }

  // Orta öncelikli ek görev (Karma soru pratiği)
  if (gap > 5 && exams.length > 0 && tasks.length < 3) {
    tasks.push({
      title: "TYT Karma Soru Pratiği",
      reason: `Konu çalışmalarının yanında genel pratik seviyeni korumak için karışık testler çözmelisin.`,
      priority: "medium",
      duration: 45,
      estimatedMinutes: 45,
    });
  }

  return tasks.slice(0, 3);
}

function checkExamTrend(exams: ExamResult[]): { dropping: boolean; dropAmount: number } {
  if (exams.length < 2) return { dropping: false, dropAmount: 0 };
  
  const lastExam = exams[exams.length - 1].tytToplamNet || 0;
  const prevExam = exams[exams.length - 2].tytToplamNet || 0;
  
  if (prevExam - lastExam >= 5) {
    return { dropping: true, dropAmount: prevExam - lastExam };
  }
  
  return { dropping: false, dropAmount: 0 };
}

export function generateCoachReport(
  user: UserProfile,
  exams: ExamResult[],
  progressMap: SubjectProgressMap = {},
  streak: StreakData | null = null,
  recentStudySessions: any[] = []
): CoachReport {
  const masteries = getAllMasteries(progressMap, exams, recentStudySessions);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  
  const todayStudySessions = recentStudySessions.filter(s => {
    const st = s.startTime?.seconds ? s.startTime.seconds * 1000 : 0;
    return st >= todayTime;
  });

  const currentTYT = user.currentTYT ?? (exams.length ? exams[exams.length - 1].tytToplamNet : 0);
  const currentAYT = user.currentAYT ?? (exams.length ? exams[exams.length - 1].aytToplamNet : 0);

  let targetTYT = 85;
  let targetAYT = 55;

  const rank = Number(user.hedefSiralama || 100000);
  if (rank <= 5000) { targetTYT = 105; targetAYT = 75; }
  else if (rank <= 10000) { targetTYT = 100; targetAYT = 72; }
  else if (rank <= 30000) { targetTYT = 95; targetAYT = 68; }
  else if (rank <= 50000) { targetTYT = 90; targetAYT = 63; }

  const currentTotal = currentTYT + currentAYT;
  const targetTotal = targetTYT + targetAYT;

  const probability = Math.min(100, targetTotal > 0 ? Math.round((currentTotal / targetTotal) * 100) : 0);

  let risk = "Düşük";
  if (probability < 40) risk = "Yüksek";
  else if (probability < 70) risk = "Orta";

  const studyHours = user.studyHours || 3;
  const dailyQuestionTarget = studyHours >= 6 ? 300 : studyHours >= 5 ? 250 : studyHours >= 4 ? 200 : studyHours >= 3 ? 150 : 100;
  const weeklyNetIncrease = Number(((targetTotal - currentTotal) / 40).toFixed(2));

  let coachMessage = "";

  const gap = targetTotal - currentTotal;
  const weakLessons = findWeakestLessons(exams);
  const weakest = weakLessons.length > 0 ? weakLessons[0] : null;

  if (exams.length === 0) {
    coachMessage = "Veri yetersiz. Performansını analiz edebilmem için önce bir deneme çözerek mevcut seviyeni belirleyelim.";
  } else {
    // Generate AI message based on facts
    const trend = checkExamTrend(exams);
    let trendMsg = "";
    if (trend.dropping) {
      trendMsg = ` Son denemende belirgin bir düşüş var (${trend.dropAmount.toFixed(1)} net). Bunu bir başarısızlık olarak görme; önce hangi ders ve konularda kayıp yaşandığını analiz edelim.`;
    }

    let streakMsg = "";
    if (streak && streak.currentStreak >= 3) {
      streakMsg = ` Ayrıca ${streak.currentStreak} günlük çalışma serin çok iyi gidiyor, bunu bozma!`;
    }

    if (gap <= 0) {
      coachMessage = `Harika! Hedefine ulaştın. Artık deneme pratikleri ve hız üzerine çalışabilirsin.${trendMsg}${streakMsg}`;
    } else if (weakest) {
      coachMessage = `Şu an hedefinin ${gap.toFixed(1)} net gerisindesin. En büyük açığın ${weakest.lesson} tarafında görünüyor. Önceliği bu alana vermelisin.${trendMsg}${streakMsg}`;
    } else {
      coachMessage = `Hedefine ulaşmak için ${gap.toFixed(1)} nete ihtiyacın var. Planlı çalışmaya devam etmelisin.${trendMsg}${streakMsg}`;
    }
  }

  const strongest = weakLessons.length > 0 ? weakLessons[weakLessons.length - 1].lesson : undefined;
  const weakestStr = weakest ? weakest.lesson : undefined;

  const daysToYKS = getDaysToYKS();

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
    strongestLesson: strongest,
    weakestLesson: weakestStr,
    todayTasks: generateDynamicTasks(user, exams, progressMap, targetTYT, targetAYT, daysToYKS, streak, todayStudySessions, masteries),
    coachMessage,
  };
}