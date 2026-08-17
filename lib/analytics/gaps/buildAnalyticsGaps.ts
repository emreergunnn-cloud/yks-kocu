import type {
  StudyTaskProgressMap,
} from "@/types/studyTaskProgress";

import type {
  AnalyticsGap,
  AnalyticsGaps,
} from "@/types/analyticsGap";

import {
  evaluateRemediation,
} from "@/lib/study/remediation/performanceEvaluator";

import {
  getGapTopicLabel,
} from "./subjectLookup";

export function buildAnalyticsGaps(
  progressMap:
    StudyTaskProgressMap
): AnalyticsGaps {
  const homework:
    AnalyticsGap[] = [];

  const topics:
    AnalyticsGap[] = [];

  for (
    const progress
    of Object.values(
      progressMap
    )
  ) {
    if (
      progress.attemptCount <= 0
    ) {
      continue;
    }

    const gap =
      createGap(progress);

    if (
      progress.remainingQuestions >
      0
    ) {
      homework.push(gap);
      continue;
    }

    if (gap.remediation) {
      topics.push(gap);
    }
  }

  homework.sort(
    compareHomework
  );

  topics.sort(
    compareTopics
  );

  return {
    homework,
    topics,

    totalRemainingQuestions:
      homework.reduce(
        (total, item) =>
          total +
          item.remainingQuestions,
        0
      ),
  };
}

function createGap(
  progress:
    StudyTaskProgressMap[string]
): AnalyticsGap {
  const label =
    getGapTopicLabel(
      progress.subjectId,
      progress.topicId
    );

  return {
    taskId:
      progress.taskId,

    subjectId:
      progress.subjectId,

    subject:
      label.subject,

    topicId:
      progress.topicId,

    topic:
      label.topic,

    attemptCount:
      progress.attemptCount,

    assignedQuestions:
      progress.lastAssignedQuestions,

    solvedQuestions:
      progress.lastSolvedQuestions,

    correct:
      progress.lastCorrect,

    wrong:
      progress.lastWrong,

    blank:
      progress.lastBlank,

    remainingQuestions:
      progress.remainingQuestions,

    accuracy:
      progress.accuracy,

    remediation:
      evaluateRemediation(
        progress
      ),
  };
}

function compareHomework(
  a: AnalyticsGap,
  b: AnalyticsGap
) {
  return (
    b.remainingQuestions -
      a.remainingQuestions ||
    a.accuracy -
      b.accuracy
  );
}

function compareTopics(
  a: AnalyticsGap,
  b: AnalyticsGap
) {
  return (
    a.accuracy -
      b.accuracy ||
    b.wrong -
      a.wrong
  );
}