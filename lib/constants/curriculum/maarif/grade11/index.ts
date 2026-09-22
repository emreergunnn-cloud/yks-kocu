import { makeSchoolSubject } from "../../builders";
import { G11_BIYOLOJI, G11_FIZIK, G11_KIMYA, G11_MATEMATIK } from "./stem";
import { G11_COGRAFYA, G11_EDEBIYAT, G11_TARIH } from "./social";

const CATEGORY = "11. Sınıf" as const;

export const MAARIF_GRADE_11_SUBJECTS = [
  makeSchoolSubject("m11_matematik", "Matematik", CATEGORY, G11_MATEMATIK),
  makeSchoolSubject("m11_fizik", "Fizik", CATEGORY, G11_FIZIK),
  makeSchoolSubject("m11_kimya", "Kimya", CATEGORY, G11_KIMYA),
  makeSchoolSubject("m11_biyoloji", "Biyoloji", CATEGORY, G11_BIYOLOJI),
  makeSchoolSubject("m11_edebiyat", "Türk Dili ve Edebiyatı", CATEGORY, G11_EDEBIYAT),
  makeSchoolSubject("m11_tarih", "Tarih", CATEGORY, G11_TARIH),
  makeSchoolSubject("m11_cografya", "Coğrafya", CATEGORY, G11_COGRAFYA),
] as const;
