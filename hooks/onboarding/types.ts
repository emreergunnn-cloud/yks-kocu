import type { AlanOption, SinifOption } from "@/types/user";

export interface OnboardingData {
  sinif: SinifOption | "";
  alan: AlanOption | "";
  hedefUniversite: string;
  hedefBolum: string;
  hedefSiralama: string;
  examYear: string;
  diplomaNotu: string;
  currentTYT: string;
  currentAYT: string;
  studyDays: string;
  studyHours: string;
}
