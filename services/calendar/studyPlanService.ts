import {
  collection,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  StudyTask,
  WeeklyStudyPlanDay,
} from "@/types/studyPlan";

import {
  formatCalendarDate,
} from "./utils";

function createStudyEvent(
  task: StudyTask,
  date: string
) {
  return {
    date,

    title:
      `${task.subject} - ${task.topic}`,

    type: "study",

    color: "bg-blue-500",

    notes:
      `${task.questionCount} soru hedefi`,

    durationMinutes:
      task.durationMinutes,

    subjectId:
      task.subjectId,

    topicId:
      task.topicId,

    studyTaskId:
      task.id,

    studyTaskType:
      task.type,

    source: "studyPlan",

    createdAt:
      Timestamp.now(),
  };
}

export async function addDailyStudyPlanToCalendar(
  uid: string,
  tasks: StudyTask[],
  startDate = new Date()
) {
  if (!tasks.length) {
    return;
  }

  const batch =
    writeBatch(db);

  const date =
    formatCalendarDate(
      startDate
    );

  for (const task of tasks) {
    const ref = doc(
      collection(
        db,
        "users",
        uid,
        "calendarEvents"
      )
    );

    batch.set(
      ref,
      createStudyEvent(
        task,
        date
      )
    );
  }

  await batch.commit();
}

export async function addWeeklyStudyPlanToCalendar(
  uid: string,
  week: WeeklyStudyPlanDay[],
  startDate = new Date()
) {
  for (const day of week) {
    const date =
      new Date(startDate);

    date.setDate(
      startDate.getDate() +
        day.dayIndex
    );

    const dateString =
      formatCalendarDate(date);

    const batch =
      writeBatch(db);

    for (const task of day.tasks) {
      const ref = doc(
        collection(
          db,
          "users",
          uid,
          "calendarEvents"
        )
      );

      batch.set(
        ref,
        createStudyEvent(
          task,
          dateString
        )
      );
    }

    await batch.commit();
  }
}