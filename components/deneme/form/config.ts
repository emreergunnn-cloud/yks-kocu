import type { AlanOption } from "@/types/user";
import type { ExamSectionConfig } from "./types";

export const TYT_SECTIONS: ExamSectionConfig[] = [
  { key: "tytTurkce", label: "Türkçe", max: 40, subjectId: "tyt_turkce" },
  { key: "tytSosyal", label: "Sosyal Bilimler", max: 20, subjectId: "tyt_sosyal" },
  { key: "tytMat", label: "Temel Matematik", max: 40, subjectId: "tyt_matematik" },
  { key: "tytFen", label: "Fen Bilimleri", max: 20, subjectId: "tyt_fen" },
];

const AYT_MAT: ExamSectionConfig = {
  key: "aytMat",
  label: "AYT Matematik",
  max: 40,
  subjectId: "ayt_matematik",
};

const EDEBIYAT: ExamSectionConfig = {
  key: "aytEdebiyat",
  label: "Edebiyat",
  max: 24,
  subjectId: "ayt_edebiyat",
};

const TARIH_1: ExamSectionConfig = {
  key: "aytTarih1",
  label: "Tarih-1",
  max: 10,
  subjectId: "ayt_tarih1",
};

const COGRAFYA_1: ExamSectionConfig = {
  key: "aytCografya1",
  label: "Coğrafya-1",
  max: 6,
  subjectId: "ayt_cografya1",
};

const SAYISAL: ExamSectionConfig[] = [
  AYT_MAT,
  { key: "aytFizik", label: "Fizik", max: 14, subjectId: "ayt_fizik" },
  { key: "aytKimya", label: "Kimya", max: 13, subjectId: "ayt_kimya" },
  { key: "aytBiyoloji", label: "Biyoloji", max: 13, subjectId: "ayt_biyoloji" },
];

const EA: ExamSectionConfig[] = [
  AYT_MAT,
  EDEBIYAT,
  TARIH_1,
  COGRAFYA_1,
];

const SOZEL: ExamSectionConfig[] = [
  EDEBIYAT,
  TARIH_1,
  COGRAFYA_1,
  { key: "aytTarih2", label: "Tarih-2", max: 11, subjectId: "ayt_tarih2" },
  { key: "aytCografya2", label: "Coğrafya-2", max: 11, subjectId: "ayt_cografya2" },
  { key: "aytFelsefe", label: "Felsefe", max: 12, subjectId: "ayt_felsefe" },
  { key: "aytDin", label: "Din Kültürü", max: 6, subjectId: "ayt_din" },
];

const DIL: ExamSectionConfig[] = [
  { key: "aytDil", label: "Yabancı Dil", max: 80, subjectId: "ayt_dil" },
];

const AYT_BY_ALAN: Partial<Record<AlanOption, ExamSectionConfig[]>> = {
  "Sayısal": SAYISAL,
  "Eşit Ağırlık": EA,
  "Sözel": SOZEL,
  "Dil": DIL,
};

export function getAytSections(alan: AlanOption): ExamSectionConfig[] {
  return AYT_BY_ALAN[alan] ?? [];
}

export const ALL_SECTIONS: ExamSectionConfig[] = Array.from(
  new Map(
    [...TYT_SECTIONS, ...SAYISAL, ...EA, ...SOZEL, ...DIL].map((item) => [
      item.key,
      item,
    ])
  ).values()
);
