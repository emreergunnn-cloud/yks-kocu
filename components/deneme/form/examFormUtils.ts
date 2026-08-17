import type { ExamResult, ExamType, SectionScore } from "@/types/exam";
import type { AlanOption } from "@/types/user";
import { buildSectionScore, calculateNet } from "@/services/examService";
import { ALL_SECTIONS, getAytSections, TYT_SECTIONS } from "./config";
import type {
  ExamData,
  ExamMetaForm,
  ExamSectionConfig,
  ScoreFieldKey,
  ScoreInputMap,
} from "./types";

function initialScore(value: SectionScore | number | undefined) {
  if (!value) return { dogru: "", yanlis: "" };
  if (typeof value === "number") return { dogru: String(value), yanlis: "" };

  return {
    dogru: String(value.dogru ?? ""),
    yanlis: String(value.yanlis ?? ""),
  };
}

export function createInitialScores(initialData?: ExamResult): ScoreInputMap {
  return Object.fromEntries(
    ALL_SECTIONS.map((section) => [
      section.key,
      initialScore(initialData?.[section.key]),
    ])
  ) as ScoreInputMap;
}

export function includesTyt(type: ExamType) {
  return type === "TYT" || type === "TYT+AYT";
}

export function includesAyt(type: ExamType) {
  return type === "AYT" || type === "TYT+AYT";
}

export function getVisibleSections(
  type: ExamType,
  alan: AlanOption
): ExamSectionConfig[] {
  return [
    ...(includesTyt(type) ? TYT_SECTIONS : []),
    ...(includesAyt(type) ? getAytSections(alan) : []),
  ];
}

function sumNet(sections: ExamSectionConfig[], scores: ScoreInputMap) {
  return Number(
    sections
      .reduce((sum, section) => {
        const score = scores[section.key];
        return sum + calculateNet(Number(score.dogru), Number(score.yanlis));
      }, 0)
      .toFixed(2)
  );
}

export function calculateExamTotals(
  scores: ScoreInputMap,
  type: ExamType,
  alan: AlanOption
) {
  const tytToplamNet = includesTyt(type) ? sumNet(TYT_SECTIONS, scores) : 0;
  const aytToplamNet = includesAyt(type) ? sumNet(getAytSections(alan), scores) : 0;

  return {
    tytToplamNet,
    aytToplamNet,
    toplamNet: Number((tytToplamNet + aytToplamNet).toFixed(2)),
  };
}

export function getScoreValidationError(
  scores: ScoreInputMap,
  type: ExamType,
  alan: AlanOption
): string | null {
  for (const section of getVisibleSections(type, alan)) {
    const score = scores[section.key];
    const dogru = Math.max(0, Number(score.dogru) || 0);
    const yanlis = Math.max(0, Number(score.yanlis) || 0);

    if (dogru + yanlis > section.max) {
      return `${section.label}: doğru + yanlış toplamı ${section.max} soruyu geçemez.`;
    }
  }

  return null;
}

export function buildExamData(
  uid: string,
  meta: ExamMetaForm,
  scores: ScoreInputMap,
  initialData?: ExamResult
): ExamData {
  const totals = calculateExamTotals(scores, meta.denemeTipi, meta.alan);

  const data: ExamData = {
    uid,
    yayinAdi: meta.yayinAdi.trim() || "Genel Deneme",
    sinavAdi: meta.sinavAdi.trim() || "Deneme Sınavı",
    denemeTipi: meta.denemeTipi,
    alan: meta.alan,
    sinavTarihi: meta.sinavTarihi,
    notlar: meta.notlar,
    weakTopics: [],
    ...totals,
    createdAt: initialData?.createdAt ?? new Date(),
  };

  const sectionValues = getVisibleSections(meta.denemeTipi, meta.alan).map(
    (section) => {
      const score = scores[section.key];
      return [
        section.key,
        buildSectionScore(
          Number(score.dogru),
          Number(score.yanlis),
          section.max
        ),
      ];
    }
  );

  Object.assign(data, Object.fromEntries(sectionValues));
  return data;
}

export function getWeakSubjectIds(
  data: ExamData,
  type: ExamType,
  alan: AlanOption
): string[] {
  return getVisibleSections(type, alan)
    .filter((section) => {
      const value = data[section.key];
      if (!value || typeof value === "number") return false;
      return value.yanlis > 0 || value.bos > 0;
    })
    .map((section) => section.subjectId);
}

export function scoreKey(key: ScoreFieldKey) {
  return key;
}
