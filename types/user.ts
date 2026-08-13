export type SinifOption = "9" | "10" | "11" | "12" | "Mezun";

export type AlanOption =
  | "Sayısal"
  | "Eşit Ağırlık"
  | "Sözel"
  | "Dil";

export type UserRole = "student" | "secretary" | "admin" | "superadmin";

export interface UserProfile {
  uid: string;

  adSoyad: string | null;
  email: string | null;
  photoURL?: string | null;

  sinif: SinifOption | "";
  alan: AlanOption | "";

  hedefUniversite?: string;
  hedefBolum: string;
  hedefSiralama: number | string;

  mezuniyetYili?: number | string;

  onboardingCompleted?: boolean;

  diplomaNotu?: number;
  obp?: number;

  currentTYT?: number;
  currentAYT?: number;

  targetTYT?: number;
  targetAYT?: number;

  studyDays?: number;
  studyHours?: number;

  examYear?: number;

  role?: UserRole;
  fcmTokens?: string[];

  createdAt: any;
  updatedAt?: any;
}
