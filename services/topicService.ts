import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  db,
} from "../lib/firebase";

import type {
  TopicStatus,
} from "../types/topic";

export type SubjectProgressMap =
  Record<
    string,
    Record<
      string,
      TopicStatus
    >
  >;

export async function getTopicProgress(
  uid: string
): Promise<SubjectProgressMap> {
  try {
    const ref = doc(
      db,
      "users",
      uid,
      "topicProgress",
      "data"
    );

    const snapshot =
      await getDoc(ref);

    if (
      !snapshot.exists()
    ) {
      return {};
    }

    return snapshot.data() as SubjectProgressMap;
  } catch (error) {
    console.error(
      "Konu ilerlemesi alınamadı:",
      error
    );

    return {};
  }
}

export async function saveTopicStatus(
  uid: string,
  subjectId: string,
  topicId: string,
  status: TopicStatus
): Promise<void> {
  const ref = doc(
    db,
    "users",
    uid,
    "topicProgress",
    "data"
  );

  await setDoc(
    ref,
    {
      [subjectId]: {
        [topicId]:
          status,
      },
    },
    {
      merge: true,
    }
  );
}

export function computeSubjectStats(
  subjectId: string,
  topicIds: string[],
  progressMap:
    SubjectProgressMap
) {
  const subject =
    progressMap[
      subjectId
    ] ?? {};

  let completed = 0;
  let studying = 0;
  let needsReview = 0;

  for (
    const topicId
    of topicIds
  ) {
    const status =
      subject[
        topicId
      ];

    if (
      status ===
      "Tamamlandı"
    ) {
      completed++;
    } else if (
      status ===
      "Çalışılıyor"
    ) {
      studying++;
    } else if (
      status ===
      "Tekrar Edilecek"
    ) {
      needsReview++;
    }
  }

  const total =
    topicIds.length;

  const notStarted =
    total -
    completed -
    studying -
    needsReview;

  const progressPct =
    total > 0
      ? Math.round(
          (
            completed /
            total
          ) * 100
        )
      : 0;

  return {
    completed,
    studying,
    needsReview,
    notStarted,
    total,
    progressPct,
  };
}

