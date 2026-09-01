import type { ExamResult, SectionScore } from "@/types/exam";

const round = (value: number) => Number(value.toFixed(2));

function isSectionScore(value: SectionScore | number | undefined): value is SectionScore {
  return typeof value === "object" && value !== null && "net" in value;
}

function getNet(value: SectionScore | number | undefined): number {
  if (value === undefined) return 0;
  if (typeof value === "number") return value;
  return isSectionScore(value) ? value.net : 0;
}

export function calculateTYTNet(exam: ExamResult): number {
  return round(getNet(exam.tytTurkce) + getNet(exam.tytSosyal) + getNet(exam.tytMat) + getNet(exam.tytFen));
}

export function calculateAYTNet(exam: ExamResult): number {
  return round(
    getNet(exam.aytMat) + getNet(exam.aytFizik) + getNet(exam.aytKimya) +
    getNet(exam.aytBiyoloji) + getNet(exam.aytEdebiyat) + getNet(exam.aytTarih1) +
    getNet(exam.aytCografya1) + getNet(exam.aytTarih2) + getNet(exam.aytCografya2) +
    getNet(exam.aytFelsefe) + getNet(exam.aytDin) + getNet(exam.aytDil)
  );
}
