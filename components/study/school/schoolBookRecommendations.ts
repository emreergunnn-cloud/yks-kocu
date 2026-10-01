import type { SchoolGrade } from "@/lib/constants/curriculum/config";

type BookMap = Record<string, readonly string[]>;

const GRADE_11_BOOKS: BookMap = {
  Matematik: [
    "Üç Dört Beş — 11. sınıf Matematik kaynağı",
    "3D Yayınları — 11. sınıf Matematik kaynağı",
  ],
  Fizik: [
    "Üç Dört Beş — 11. sınıf Fizik kaynağı",
    "3D Yayınları — 11. sınıf Fizik kaynağı",
  ],
  Kimya: [
    "Üç Dört Beş — 11. sınıf Kimya kaynağı",
    "Orbital — 11. sınıf Kimya kaynağı",
  ],
  Biyoloji: [
    "Üç Dört Beş — 11. sınıf Biyoloji kaynağı",
    "Biyotik — 11. sınıf Biyoloji kaynağı",
  ],
  "Türk Dili ve Edebiyatı": [
    "Üç Dört Beş — 11. sınıf Edebiyat kaynağı",
  ],
  Tarih: [
    "Üç Dört Beş — 11. sınıf Tarih kaynağı",
    "Bilgi Sarmal — 11. sınıf Tarih kaynağı",
  ],
  Coğrafya: [
    "Üç Dört Beş — 11. sınıf Coğrafya kaynağı",
  ],
};

export function getSchoolBookRecommendations(grade: SchoolGrade, subject: string) {
  if (grade !== "11") return [];
  return GRADE_11_BOOKS[subject] ?? [];
}
