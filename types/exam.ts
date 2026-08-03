import { AlanOption } from "./user";

export type ExamType = "TYT" | "AYT" | "TYT+AYT";

export interface SectionScore {
  dogru: number;
  yanlis: number;
  net: number;
}

export interface ExamResult {
  id?: string;
  uid: string;
  yayinAdi?: string;
  denemeTipi: ExamType;
  alan: AlanOption;
  
  // Legacy flat fields for backward compatibility
  tytTurkce?: number | SectionScore;
  tytSosyal?: number | SectionScore;
  tytMat?: number | SectionScore;
  tytFen?: number | SectionScore;

  aytMat?: number | SectionScore;
  aytFizik?: number | SectionScore;
  aytKimya?: number | SectionScore;
  aytBiyoloji?: number | SectionScore;
  aytEdebiyat?: number | SectionScore;
  aytTarih1?: number | SectionScore;
  aytCografya1?: number | SectionScore;
  aytTarih2?: number | SectionScore;
  aytCografya2?: number | SectionScore;
  aytFelsefe?: number | SectionScore;
  aytDin?: number | SectionScore;
  aytDil?: number | SectionScore;

  tytToplamNet?: number;
  aytToplamNet?: number;
  toplamNet?: number;
  createdAt: any;
}
