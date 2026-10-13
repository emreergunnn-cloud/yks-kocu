import type { ExamResult, SectionScore } from "@/types/exam";
import type { AlanOption } from "@/types/user";
import type { SectionAverage } from "./types";

type SectionKey = keyof Pick<
  ExamResult,
  | "tytTurkce" | "tytSosyal" | "tytMat" | "tytFen"
  | "aytMat" | "aytFizik" | "aytKimya" | "aytBiyoloji"
  | "aytEdebiyat" | "aytTarih1" | "aytCografya1"
  | "aytTarih2" | "aytCografya2" | "aytFelsefe" | "aytDin" | "aytDil"
>;

interface SectionDefinition {
  key: SectionKey;
  name: string;
  maxScore: number;
}

const TYT: SectionDefinition[] = [
  { key: "tytTurkce", name: "TYT Türkçe", maxScore: 40 },
  { key: "tytSosyal", name: "TYT Sosyal", maxScore: 20 },
  { key: "tytMat", name: "TYT Matematik", maxScore: 40 },
  { key: "tytFen", name: "TYT Fen", maxScore: 20 },
];

const AYT: Record<AlanOption, SectionDefinition[]> = {
  Sayısal: [
    { key: "aytMat", name: "AYT Matematik", maxScore: 40 },
    { key: "aytFizik", name: "AYT Fizik", maxScore: 14 },
    { key: "aytKimya", name: "AYT Kimya", maxScore: 13 },
    { key: "aytBiyoloji", name: "AYT Biyoloji", maxScore: 13 },
  ],
  "Eşit Ağırlık": [
    { key: "aytMat", name: "AYT Matematik", maxScore: 40 },
    { key: "aytEdebiyat", name: "AYT Edebiyat", maxScore: 24 },
    { key: "aytTarih1", name: "AYT Tarih-1", maxScore: 10 },
    { key: "aytCografya1", name: "AYT Coğrafya-1", maxScore: 6 },
  ],
  Sözel: [
    { key: "aytEdebiyat", name: "AYT Edebiyat", maxScore: 24 },
    { key: "aytTarih1", name: "AYT Tarih-1", maxScore: 10 },
    { key: "aytCografya1", name: "AYT Coğrafya-1", maxScore: 6 },
    { key: "aytTarih2", name: "AYT Tarih-2", maxScore: 11 },
    { key: "aytCografya2", name: "AYT Coğrafya-2", maxScore: 11 },
    { key: "aytFelsefe", name: "AYT Felsefe", maxScore: 12 },
    { key: "aytDin", name: "AYT Din", maxScore: 6 },
  ],
  Dil: [{ key: "aytDil", name: "YDT", maxScore: 80 }],
};

function getNet(value: SectionScore | number | undefined) {
  if (value === undefined || value === null) return 0;
  return typeof value === "number" ? value : value.net ?? 0;
}

function buildAverage(exams: ExamResult[], definition: SectionDefinition): SectionAverage | null {
  const relevant = exams.filter((exam) => exam[definition.key] !== undefined);
  if (!relevant.length) return null;
  const total = relevant.reduce((sum, exam) => sum + getNet(exam[definition.key]), 0);
  const avgNet = Number((total / relevant.length).toFixed(1));
  return {
    name: definition.name,
    avgNet,
    maxScore: definition.maxScore,
    percentage: Math.round((avgNet / definition.maxScore) * 100),
  };
}

export function buildSectionAverages(
  exams: ExamResult[],
  alan: AlanOption | ""
): SectionAverage[] {
  const fallbackAlan = exams.find((exam) => exam.alan)?.alan;
  const activeAlan = alan || fallbackAlan;
  const definitions = [...TYT, ...(activeAlan ? AYT[activeAlan] ?? [] : [])];
  return definitions
    .map((definition) => buildAverage(exams, definition))
    .filter((item): item is SectionAverage => item !== null);
}
