import {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

interface Result {
  subject: string;
  topic: string;
}

export function getGapTopicLabel(
  subjectId: string,
  topicId: string
): Result {
  const subject =
    YKS_SUBJECTS.find(
      (item) =>
        item.id === subjectId
    );

  const topic =
    subject?.topics.find(
      (item) =>
        item.id === topicId
    );

  return {
    subject:
      subject?.name ??
      subjectId,

    topic:
      topic?.name ??
      topicId,
  };
}