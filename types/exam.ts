import { AlanOption } from "./user";

export type ExamType = "TYT" | "AYT" | "TYT+AYT";

export interface SectionScore {
  dogru: number;
  yanlis: number;
  bos: number;
  net: number;
}

export interface ExamResult {
  id?: string;
  uid: string;
  yayinAdi?: string;
  sinavAdi?: string;
  denemeTipi: ExamType;
  alan: AlanOption;
  sinavTarihi?: string;
  notlar?: string;
  
  // TYT Sections
  tytTurkce?: SectionScore | number;
  tytSosyal?: SectionScore | number;
  tytMat?: SectionScore | number;
  tytFen?: SectionScore | number;

  // AYT Sections
  aytMat?: SectionScore | number;
  aytFizik?: SectionScore | number;
  aytKimya?: SectionScore | number;
  aytBiyoloji?: SectionScore | number;
  aytEdebiyat?: SectionScore | number;
  aytTarih1?: SectionScore | number;
  aytCografya1?: SectionScore | number;
  aytTarih2?: SectionScore | number;
  aytCografya2?: SectionScore | number;
  aytFelsefe?: SectionScore | number;
  aytDin?: SectionScore | number;
  aytDil?: SectionScore | number;

  tytToplamNet: number;
  aytToplamNet: number;
  toplamNet: number;
  yksTahminiPuan?: number;
  createdAt: any;
  updatedAt?: any;
}

export interface RankingEstimate {
  year: 2024 | 2025 | 2026;
  siralama: number;
}

export interface CalculatedExamResult {
  tytNet: number;
  aytNet: number;
  estimates: RankingEstimate[];
}