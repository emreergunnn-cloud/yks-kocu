import {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

import {
  computeSubjectStats,
  type SubjectProgressMap,
} from "@/services/topicService";

import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  StudyTaskProgressMap,
} from "@/types/studyTaskProgress";

import type {
  AlanOption,
} from "@/types/user";

import {
  buildCarryoverCandidate,
} from "./buildCarryoverCandidate";

import {
  buildStudyCandidate,
} from "./buildStudyCandidate";

type StudySubject =
  (typeof YKS_SUBJECTS)[number];

interface Options {
  subject:
    StudySubject;

  progressMap:
    SubjectProgressMap;

  alan:
    AlanOption | "";

  taskProgress:
    StudyTaskProgressMap;

  excludedTaskIds:
    ReadonlySet<string>;
}

interface Result {
  carryovers:
    StudyTask[];

  regular:
    StudyTask[];
}

export function buildSubjectCandidates({
  subject,
  progressMap,
  alan,
  taskProgress,
  excludedTaskIds,
}: Options): Result {
  const result: Result = {
    carryovers: [],
    regular: [],
  };

  const stats =
    computeSubjectStats(
      subject.id,

      subject.topics.map(
        (topic) =>
          topic.id
      ),

      progressMap
    );

  subject.topics.forEach(
    (topic, topicIndex) => {
      const taskId =
        `${subject.id}-${topic.id}`;

      const history =
        taskProgress[
          taskId
        ];

      if (
        history &&
        history.remainingQuestions >
          0
      ) {
        const carryover =
          buildCarryoverCandidate({
            subjectId:
              subject.id,

            subjectName:
              subject.name,

            category:
              subject.category,

            topicId:
              topic.id,

            topicName:
              topic.name,

            alan,

            history,
          });

        if (
          !excludedTaskIds.has(
            carryover.id
          )
        ) {
          result.carryovers.push(
            carryover
          );
        }

        return;
      }

      const candidate =
        buildStudyCandidate({
          subjectId:
            subject.id,

          subjectName:
            subject.name,

          category:
            subject.category,

          topicId:
            topic.id,

          topicName:
            topic.name,

          topicIndex,

          subjectProgressPct:
            stats.progressPct,

          progressMap,
          alan,
          taskProgress,
        });

      if (
        candidate &&
        !excludedTaskIds.has(
          candidate.id
        )
      ) {
        result.regular.push(
          candidate
        );
      }
    }
  );

  return result;
}