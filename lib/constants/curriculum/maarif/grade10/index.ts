import { makeSchoolSubject } from "../../builders";
import { G10_BIYOLOJI, G10_FIZIK, G10_KIMYA, G10_MATEMATIK } from "./stem";
import { G10_COGRAFYA, G10_EDEBIYAT, G10_TARIH } from "./social";

const CATEGORY = "10. Sınıf" as const;

export const MAARIF_GRADE_10_SUBJECTS = [
  makeSchoolSubject("m10_matematik", "Matematik", CATEGORY, G10_MATEMATIK),
  makeSchoolSubject("m10_fizik", "Fizik", CATEGORY, G10_FIZIK),
  makeSchoolSubject("m10_kimya", "Kimya", CATEGORY, G10_KIMYA),
  makeSchoolSubject("m10_biyoloji", "Biyoloji", CATEGORY, G10_BIYOLOJI),
  makeSchoolSubject("m10_edebiyat", "Türk Dili ve Edebiyatı", CATEGORY, G10_EDEBIYAT),
  makeSchoolSubject("m10_tarih", "Tarih", CATEGORY, G10_TARIH),
  makeSchoolSubject("m10_cografya", "Coğrafya", CATEGORY, G10_COGRAFYA),
] as const;
