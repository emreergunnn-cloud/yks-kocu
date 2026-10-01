import type { AlanOption } from "@/types/user";
import { makeSchoolSubject } from "../../builders";
import { G11_BIYOLOJI, G11_FIZIK, G11_KIMYA, G11_MATEMATIK } from "./stem";
import { G11_COGRAFYA, G11_EDEBIYAT, G11_TARIH } from "./social";

const CATEGORY = "11. Sınıf" as const;

const MATEMATIK = makeSchoolSubject("m11_matematik", "Matematik", CATEGORY, G11_MATEMATIK);
const FIZIK = makeSchoolSubject("m11_fizik", "Fizik", CATEGORY, G11_FIZIK);
const KIMYA = makeSchoolSubject("m11_kimya", "Kimya", CATEGORY, G11_KIMYA);
const BIYOLOJI = makeSchoolSubject("m11_biyoloji", "Biyoloji", CATEGORY, G11_BIYOLOJI);
const EDEBIYAT = makeSchoolSubject("m11_edebiyat", "Türk Dili ve Edebiyatı", CATEGORY, G11_EDEBIYAT);
const TARIH = makeSchoolSubject("m11_tarih", "Tarih", CATEGORY, G11_TARIH);
const COGRAFYA = makeSchoolSubject("m11_cografya", "Coğrafya", CATEGORY, G11_COGRAFYA);

export const MAARIF_GRADE_11_SUBJECTS = [
  MATEMATIK,
  FIZIK,
  KIMYA,
  BIYOLOJI,
  EDEBIYAT,
  TARIH,
  COGRAFYA,
] as const;

const GRADE_11_SAYISAL_SUBJECTS = [
  MATEMATIK,
  FIZIK,
  KIMYA,
  BIYOLOJI,
  EDEBIYAT,
  TARIH,
] as const;

const GRADE_11_EA_SUBJECTS = [
  MATEMATIK,
  EDEBIYAT,
  TARIH,
  COGRAFYA,
] as const;

const GRADE_11_COMMON_SUBJECTS = [EDEBIYAT, TARIH] as const;

export function getGrade11Subjects(alan: AlanOption | "") {
  if (alan === "Sayısal") return GRADE_11_SAYISAL_SUBJECTS;
  if (alan === "Eşit Ağırlık") return GRADE_11_EA_SUBJECTS;
  return GRADE_11_COMMON_SUBJECTS;
}
