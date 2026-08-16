import {
  collection,
  doc,
  writeBatch,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import type {
  StudyTask,
  WeeklyStudyPlanDay,
} from "@/types/studyPlan";

import {
  createStudyEvent,
} from "./studyEventFactory";

import {
  formatCalendarDate,
} from "./utils";

export async function addDailyStudyPlanToCalendar(
  uid: string,

  tasks:
    StudyTask[],

  startDate =
    new Date()
): Promise<void> {
  if (!tasks.length) {
    return;
  }

  const date =
    formatCalendarDate(
      startDate
    );

  await writeTasks(
    uid,
    tasks,
    date
  );
}

export async function addWeeklyStudyPlanToCalendar(
  uid: string,

  week:
    WeeklyStudyPlanDay[],

  startDate =
    new Date()
): Promise<void> {
  for (
    const day
    of week
  ) {
    const date =
      new Date(
        startDate
      );

    date.setDate(
      startDate.getDate() +
        day.dayIndex
    );

    await writeTasks(
      uid,
      day.tasks,

      formatCalendarDate(
        date
      )
    );
  }
}

async function writeTasks(
  uid: string,

  tasks:
    StudyTask[],

  date: string
): Promise<void> {
  if (!tasks.length) {
    return;
  }

  const batch =
    writeBatch(db);

  for (
    const task
    of tasks
  ) {
    const ref =
      doc(
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