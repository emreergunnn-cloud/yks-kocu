import {
  makeSubject,
} from "../builders";

import {
  AYT_MATEMATIK_TOPICS,
} from "./matematik";

import {
  AYT_FIZIK_TOPICS,
  AYT_KIMYA_TOPICS,
  AYT_BIYOLOJI_TOPICS,
} from "./fen";

import {
  AYT_EDEBIYAT_TOPICS,
  AYT_TARIH1_TOPICS,
  AYT_COGRAFYA1_TOPICS,
} from "./edebiyatSosyal1";

import {
  AYT_TARIH2_TOPICS,
  AYT_COGRAFYA2_TOPICS,
  AYT_FELSEFE_TOPICS,
  AYT_DIN_TOPICS,
} from "./sosyal2";

const SAYISAL = [
  "Sayısal",
] as const;

const SAYISAL_EA = [
  "Sayısal",
  "Eşit Ağırlık",
] as const;

const EA_SOZEL = [
  "Eşit Ağırlık",
  "Sözel",
] as const;

const SOZEL = [
  "Sözel",
] as const;

export const AYT_SUBJECTS = [
  makeSubject(
    "ayt_matematik",
    "AYT Matematik",
    "AYT",
    40,
    AYT_MATEMATIK_TOPICS,
    SAYISAL_EA
  ),

  makeSubject(
    "ayt_fizik",
    "AYT Fizik",
    "AYT",
    14,
    AYT_FIZIK_TOPICS,
    SAYISAL
  ),

  makeSubject(
    "ayt_kimya",
    "AYT Kimya",
    "AYT",
    13,
    AYT_KIMYA_TOPICS,
    SAYISAL
  ),

  makeSubject(
    "ayt_biyoloji",
    "AYT Biyoloji",
    "AYT",
    13,
    AYT_BIYOLOJI_TOPICS,
    SAYISAL
  ),

  makeSubject(
    "ayt_edebiyat",
    "AYT Türk Dili ve Edebiyatı",
    "AYT",
    24,
    AYT_EDEBIYAT_TOPICS,
    EA_SOZEL
  ),

  makeSubject(
    "ayt_tarih1",
    "AYT Tarih-1",
    "AYT",
    10,
    AYT_TARIH1_TOPICS,
    EA_SOZEL
  ),

  makeSubject(
    "ayt_cografya1",
    "AYT Coğrafya-1",
    "AYT",
    6,
    AYT_COGRAFYA1_TOPICS,
    EA_SOZEL
  ),

  makeSubject(
    "ayt_tarih2",
    "AYT Tarih-2",
    "AYT",
    11,
    AYT_TARIH2_TOPICS,
    SOZEL
  ),

  makeSubject(
    "ayt_cografya2",
    "AYT Coğrafya-2",
    "AYT",
    11,
    AYT_COGRAFYA2_TOPICS,
    SOZEL
  ),

  makeSubject(
    "ayt_felsefe",
    "AYT Felsefe Grubu",
    "AYT",
    12,
    AYT_FELSEFE_TOPICS,
    SOZEL
  ),

  makeSubject(
    "ayt_din",
    "AYT Din Kültürü",
    "AYT",
    6,
    AYT_DIN_TOPICS,
    SOZEL
  ),
] as const;