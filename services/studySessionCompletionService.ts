import {
  getTopicProgress,
  saveTopicStatus,
} from "@/services/topicService";

import {
  recordStudyActivity,
} from "@/services/streakService";

import {
  saveStudySession,
} from "@/services/studyService";

interface Options {
  uid: string;
  subject: string;
  duration: number;

  subjectId?: string;
  topicId?: string;

  note?: string;
}

export async function completeStudySession({
  uid,
  subject,
  duration,
  subjectId,
  topicId,
  note,
}: Options) {
  const session =
    await saveStudySession(
      uid,
      subject,
      duration,
      subjectId,
      topicId,
      note
    );

  try {
    await recordStudyActivity(
      uid,
      session.endTime.toMillis()
    );
  } catch (error) {
    console.error(
      "Streak güncellenemedi:",
      error
    );
  }

  if (
    subjectId &&
    topicId
  ) {
    try {
      const progress =
        await getTopicProgress(
          uid
        );

      const current =
        progress[
          subjectId
        ]?.[topicId];

      if (
        !current ||
        current ===
          "Başlanmadı"
      ) {
        await saveTopicStatus(
          uid,
          subjectId,
          topicId,
          "Çalışılıyor"
        );
      }
    } catch (error) {
      console.error(
        "Konu ilerlemesi güncellenemedi:",
        error
      );
    }
  }

  return session;
}
