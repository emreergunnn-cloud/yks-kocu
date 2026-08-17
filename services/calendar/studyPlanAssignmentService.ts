import {
  collection,
  doc,
  runTransaction,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import type {
  StudyTask,
  WeeklyStudyPlanDay,
} from "@/types/studyPlan";

import {
  incrementAssignmentHistory,
} from "@/services/studyPlan/assignmentHistoryService";

import {
  writeStudyPlanInTransaction,
} from "@/services/studyPlan/writeService";

import {
  createStudyEvent,
} from "./studyEventFactory";

import {
  formatCalendarDate,
} from "./utils";

interface CalendarTaskEntry {
  task: StudyTask;
  date: string;
}

async function saveAssignment(
  uid: string,

  mode:
    "daily" | "weekly",

  selectedDate: string,

  entries:
    CalendarTaskEntry[]
) {
  if (!entries.length) {
    return;
  }

  const taskIds =
    entries.map(
      (entry) =>
        entry.task.id
    );

  await runTransaction(
    db,

    async (
      transaction
    ) => {
      await incrementAssignmentHistory(
        transaction,
        uid,
        taskIds
      );

      writeStudyPlanInTransaction(
        transaction,
        uid,
        mode,
        selectedDate,
        taskIds
      );

      for (
        const entry
        of entries
      ) {
        const ref = doc(
          collection(
            db,
            "users",
            uid,
            "calendarEvents"
          )
        );

        transaction.set(
          ref,

          createStudyEvent(
            entry.task,
            entry.date
          )
        );
      }
    }
  );
}

export async function saveDailyStudyPlanAssignment(
  uid: string,

  tasks:
    StudyTask[],

  selectedDate: string,

  startDate:
    Date
) {
  const date =
    formatCalendarDate(
      startDate
    );

  await saveAssignment(
    uid,
    "daily",
    selectedDate,

    tasks.map(
      (task) => ({
        task,
        date,
      })
    )
  );
}

export async function saveWeeklyStudyPlanAssignment(
  uid: string,

  week:
    WeeklyStudyPlanDay[],

  selectedDate: string,

  startDate:
    Date
) {
  const entries:
    CalendarTaskEntry[] = [];

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

    const formattedDate =
      formatCalendarDate(
        date
      );

    for (
      const task
      of day.tasks
    ) {
      entries.push({
        task,
        date:
          formattedDate,
      });
    }
  }

  await saveAssignment(
    uid,
    "weekly",
    selectedDate,
    entries
  );
}
