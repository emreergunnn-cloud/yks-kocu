import {
  TYT_EXAM_IMPACT,
} from "./tyt";

import {
  AYT_SAYISAL_EXAM_IMPACT,
} from "./aytSayisal";

import {
  AYT_VERBAL_EXAM_IMPACT,
} from "./aytVerbal";

export const YKS_EXAM_IMPACT = [
  ...TYT_EXAM_IMPACT,
  ...AYT_SAYISAL_EXAM_IMPACT,
  ...AYT_VERBAL_EXAM_IMPACT,
];

export function findExamImpact(
  topicId: string
) {
  return YKS_EXAM_IMPACT.find(
    (item) =>
      item.topicId === topicId
  );
}