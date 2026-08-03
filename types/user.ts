export type SinifOption = "9" | "10" | "11" | "12" | "Mezun";
export type AlanOption = "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil";

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
  createdAt: any;
  updatedAt?: any;
}
