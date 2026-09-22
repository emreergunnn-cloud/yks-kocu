import { makeSchoolSubject } from "../../builders";
import { G9_BIYOLOJI, G9_FIZIK, G9_KIMYA, G9_MATEMATIK } from "./stem";
import { G9_COGRAFYA, G9_EDEBIYAT, G9_TARIH } from "./social";

const CATEGORY = "9. Sınıf" as const;

export const MAARIF_GRADE_9_SUBJECTS = [
  makeSchoolSubject("m9_matematik", "Matematik", CATEGORY, G9_MATEMATIK),
  makeSchoolSubject("m9_fizik", "Fizik", CATEGORY, G9_FIZIK),
  makeSchoolSubject("m9_kimya", "Kimya", CATEGORY, G9_KIMYA),
  makeSchoolSubject("m9_biyoloji", "Biyoloji", CATEGORY, G9_BIYOLOJI),
  makeSchoolSubject("m9_edebiyat", "Türk Dili ve Edebiyatı", CATEGORY, G9_EDEBIYAT),
  makeSchoolSubject("m9_tarih", "Tarih", CATEGORY, G9_TARIH),
  makeSchoolSubject("m9_cografya", "Coğrafya", CATEGORY, G9_COGRAFYA),
] as const;
