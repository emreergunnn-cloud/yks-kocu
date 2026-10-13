import type { ExamResult } from "@/types/exam";
import type { TrendPoint } from "./types";

export function includesTyt(exam: ExamResult) {
  return exam.denemeTipi === "TYT" || exam.denemeTipi === "TYT+AYT";
}

export function includesAyt(exam: ExamResult) {
  return exam.denemeTipi === "AYT" || exam.denemeTipi === "TYT+AYT";
}

export function getExamTime(exam: ExamResult) {
  if (exam.sinavTarihi) return new Date(exam.sinavTarihi).getTime();

  const createdAt = exam.createdAt as {
    seconds?: number;
    toMillis?: () => number;
  };

  if (typeof createdAt?.toMillis === "function") return createdAt.toMillis();
  return Number(createdAt?.seconds ?? 0) * 1000;
}

export function sortExams(exams: ExamResult[]) {
  return [...exams].sort((a, b) => getExamTime(a) - getExamTime(b));
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

export function buildExamMetrics(sortedExams: ExamResult[]) {
  const tytExams = sortedExams.filter(includesTyt);
  const aytExams = sortedExams.filter(includesAyt);
  const tytNets = tytExams.map((exam) => exam.tytToplamNet ?? 0);
  const aytNets = aytExams.map((exam) => exam.aytToplamNet ?? 0);
  const totalNets = sortedExams.map((exam) => exam.toplamNet ?? 0);

  return {
    totalExams: sortedExams.length,
    avgTytNet: average(tytNets),
    maxTytNet: Math.max(...tytNets, 0),
    latestTytNet: tytNets.at(-1) ?? 0,
    avgAytNet: average(aytNets),
    maxAytNet: Math.max(...aytNets, 0),
    latestAytNet: aytNets.at(-1) ?? 0,
    avgToplamNet: average(totalNets),
  };
}

export function buildTrendData(sortedExams: ExamResult[]): TrendPoint[] {
  return sortedExams.map((exam, index) => ({
    id: exam.id ?? `exam-${index}`,
    date: exam.sinavTarihi
      ? new Date(exam.sinavTarihi).toLocaleDateString("tr-TR", { month: "short", day: "numeric" })
      : "Tarihsiz",
    yayin: exam.yayinAdi || "Deneme",
    tytNet: includesTyt(exam) ? exam.tytToplamNet ?? 0 : null,
    aytNet: includesAyt(exam) ? exam.aytToplamNet ?? 0 : null,
    toplamNet: exam.toplamNet ?? 0,
  }));
}
