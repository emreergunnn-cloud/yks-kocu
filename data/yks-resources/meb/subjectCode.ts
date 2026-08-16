const SUBJECT_CODES:
  Record<string, string> = {
  tyt_turkce: "TDE",
  tyt_matematik: "MAT",

  ayt_matematik: "MAT",
  ayt_fizik: "FIZ",
  ayt_kimya: "KIM",
  ayt_biyoloji: "BIY",

  ayt_edebiyat: "TDE",

  ayt_tarih1: "TAR",
  ayt_tarih2: "TAR",

  ayt_cografya1: "COG",
  ayt_cografya2: "COG",

  ayt_felsefe: "FEL",
  ayt_din: "DIN",
};

const TOPIC_CODES = [
  ["tf_fizik_", "FIZ"],
  ["tf_kimya_", "KIM"],
  ["tf_biyo_", "BIY"],
  ["ts_tar_", "TAR"],
  ["ts_cog_", "COG"],
  ["ts_fel_", "FEL"],
  ["ts_din_", "DIN"],
] as const;

export function resolveMebVideoCode(
  subjectId: string,
  topicId: string
): string {
  const subjectCode =
    SUBJECT_CODES[subjectId];

  if (subjectCode) {
    return subjectCode;
  }

  const match =
    TOPIC_CODES.find(
      ([prefix]) =>
        topicId.startsWith(
          prefix
        )
    );

  return match?.[1] ?? "";
}