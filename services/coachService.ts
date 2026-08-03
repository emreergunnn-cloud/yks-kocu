import { ExamResult, SectionScore } from "../types/exam";
import { TopicStatus } from "../types/topic";
import { SubjectProgressMap } from "./topicService";

export interface Recommendation {
  id: string;
  type: "study" | "revision" | "exam" | "motivation";
  subject: string;
  topic?: string;
  reason: string;
  estimatedMinutes: number;
  difficulty: "Kolay" | "Orta" | "Zor";
  priority: "Yüksek" | "Orta" | "Düşük";
  motivationSentence: string;
}

function getSectionNet(val: SectionScore | number | undefined): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  return val.net ?? 0;
}

function motivationFor(subject: string): string {
  const msgs: Record<string, string> = {
    "TYT Türkçe": "Her paragraf bir adım daha yakın!",
    "TYT Matematik": "Sayılar seni bekliyor, hazır mısın?",
    "TYT Fen Bilimleri": "Bilim dünyası kapılarını açıyor!",
    "TYT Sosyal Bilimler": "Tarih ve coğrafya seni güçlendiriyor!",
    "AYT Matematik": "İntegraller artık senin için!",
    "AYT Fizik": "Kuvvetini hisset, fiziği fethet!",
    "AYT Kimya": "Her molekül bir zafer!",
    "AYT Biyoloji": "Hayat bilimleri seni bekliyor!",
    "AYT Türk Dili ve Edebiyatı": "Edebiyat ruhu zenginleştirir!",
  };
  return msgs[subject] ?? "Hedefine bir adım daha yaklaş!";
}

export function generateRecommendations(
  exams: ExamResult[],
  progressMap: SubjectProgressMap,
  subjects: Array<{ id: string; name: string; topics: Array<{ id: string }> }>
): Recommendation[] {
  const recs: Recommendation[] = [];

  // 1. Weak subject detection from exams
  if (exams.length > 0) {
    const sectionNets: Record<string, number[]> = {
      "TYT Türkçe": exams.map((e) => getSectionNet(e.tytTurkce)),
      "TYT Matematik": exams.map((e) => getSectionNet(e.tytMat)),
      "TYT Fen Bilimleri": exams.map((e) => getSectionNet(e.tytFen)),
      "TYT Sosyal Bilimler": exams.map((e) => getSectionNet(e.tytSosyal)),
      "AYT Matematik": exams.map((e) => getSectionNet(e.aytMat)),
      "AYT Fizik": exams.map((e) => getSectionNet(e.aytFizik)),
      "AYT Kimya": exams.map((e) => getSectionNet(e.aytKimya)),
      "AYT Biyoloji": exams.map((e) => getSectionNet(e.aytBiyoloji)),
    };

    const maxNets: Record<string, number> = {
      "TYT Türkçe": 40, "TYT Matematik": 40, "TYT Fen Bilimleri": 20,
      "TYT Sosyal Bilimler": 20, "AYT Matematik": 40, "AYT Fizik": 14,
      "AYT Kimya": 13, "AYT Biyoloji": 13,
    };

    const weakSubjects: Array<{ name: string; pct: number }> = [];
    for (const [name, nets] of Object.entries(sectionNets)) {
      const avg = nets.reduce((a, b) => a + b, 0) / nets.length;
      const pct = (avg / (maxNets[name] ?? 40)) * 100;
      if (pct < 50) weakSubjects.push({ name, pct });
    }

    weakSubjects.sort((a, b) => a.pct - b.pct);
    for (const ws of weakSubjects.slice(0, 3)) {
      recs.push({
        id: `weak-${ws.name}`,
        type: "study",
        subject: ws.name,
        reason: `Bu derste ortalama doluluk oranın %${Math.round(ws.pct)} — en zayıf dersin.`,
        estimatedMinutes: 60,
        difficulty: ws.pct < 25 ? "Zor" : "Orta",
        priority: "Yüksek",
        motivationSentence: motivationFor(ws.name),
      });
    }
  }

  // 2. Untouched topics
  for (const subject of subjects) {
    const subjectProgress = progressMap[subject.id] ?? {};
    const untouched = subject.topics.filter(
      (t) => !subjectProgress[t.id] || subjectProgress[t.id] === "Başlanmadı"
    );
    if (untouched.length > 3) {
      recs.push({
        id: `untouched-${subject.id}`,
        type: "study",
        subject: subject.name,
        topic: `${untouched.length} konu başlanmadı`,
        reason: `${subject.name} dersinde ${untouched.length} konu henüz çalışılmadı.`,
        estimatedMinutes: 45,
        difficulty: "Orta",
        priority: "Orta",
        motivationSentence: motivationFor(subject.name),
      });
    }
  }

  // 3. Needs review topics
  for (const subject of subjects) {
    const subjectProgress = progressMap[subject.id] ?? {};
    const needsReview = subject.topics.filter(
      (t) => subjectProgress[t.id] === "Tekrar Edilecek"
    );
    if (needsReview.length > 0) {
      recs.push({
        id: `review-${subject.id}`,
        type: "revision",
        subject: subject.name,
        topic: `${needsReview.length} konu tekrar edilecek`,
        reason: `${subject.name}'de ${needsReview.length} konu tekrar işaretlendi.`,
        estimatedMinutes: 30,
        difficulty: "Orta",
        priority: "Orta",
        motivationSentence: "Tekrar etmek kalıcı öğrenmenin anahtarıdır!",
      });
    }
  }

  // 4. Exam recommendation if few exams
  if (exams.length < 3) {
    recs.push({
      id: "exam-low",
      type: "exam",
      subject: "Genel",
      reason: "Az deneme sonucu var — daha fazla deneme girerek gelişimini takip et.",
      estimatedMinutes: 180,
      difficulty: "Orta",
      priority: "Yüksek",
      motivationSentence: "Denemelerin puanını analiz etmek başarının ilk adımıdır!",
    });
  }

  // 5. Motivation if all going well
  if (recs.length === 0) {
    recs.push({
      id: "motivation-all-good",
      type: "motivation",
      subject: "Genel",
      reason: "Harika gidiyorsun! Tüm dersler dengeli çalışılıyor.",
      estimatedMinutes: 0,
      difficulty: "Kolay",
      priority: "Düşük",
      motivationSentence: "Devam et, hedefine çok az kaldı! 🎯",
    });
  }

  return recs.slice(0, 6);
}
