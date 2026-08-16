import type {
  MebResource,
} from "@/types/remediation";

import {
  MEB_PRACTICE_URL,
  MEB_SOLVED_URL,
  MEB_SUMMARY_URL,
  MEB_VIDEO_BASE,
  MEB_YKS_HOME,
} from "./links";

import {
  resolveMebVideoCode,
} from "./subjectCode";

export function getMebResources(
  subjectId: string,
  topicId: string
): MebResource[] {
  const code =
    resolveMebVideoCode(
      subjectId,
      topicId
    );

  const videoUrl = code
    ? `${MEB_VIDEO_BASE}?d=0&k=0&kod=${code}&s=0&u=0`
    : MEB_YKS_HOME;

  return [
    {
      kind: "video",
      label: "MEB Konu Anlatımı",
      url: videoUrl,
    },
    {
      kind: "summary",
      label: "MEB Konu Özeti",
      url: MEB_SUMMARY_URL,
    },
    {
      kind: "solved",
      label:
        "Çıkmış Soru Çözümleri",
      url: MEB_SOLVED_URL,
    },
    {
      kind: "practice",
      label:
        "Konu Pekiştirme Testleri",
      url: MEB_PRACTICE_URL,
    },
  ];
}