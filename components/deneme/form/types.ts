import type { ExamResult, ExamType } from "@/types/exam";
import type { AlanOption } from "@/types/user";

export type ScoreFieldKey =
  | "tytTurkce"
  | "tytSosyal"
  | "tytMat"
  | "tytFen"
  | "aytMat"
  | "aytFizik"
  | "aytKimya"
  | "aytBiyoloji"
  | "aytEdebiyat"
  | "aytTarih1"
  | "aytCografya1"
  | "aytTarih2"
  | "aytCografya2"
  | "aytFelsefe"
  | "aytDin"
  | "aytDil";

export interface ScoreInput {
  dogru: string;
  yanlis: string;
}

export type ScoreInputMap = Record<ScoreFieldKey, ScoreInput>;

export interface ExamMetaForm {
  yayinAdi: string;
  sinavAdi: string;
  denemeTipi: ExamType;
  alan: AlanOption;
  sinavTarihi: string;
  notlar: string;
}

export interface ExamSectionConfig {
  key: ScoreFieldKey;
  label: string;
  max: number;
  subjectId: string;
}

export type ExamData = Omit<ExamResult, "id">;
