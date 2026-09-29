import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  AlanOption,
  SinifOption,
} from "@/types/user";

import {
  getCalendarEvents,
  parseCalendarDate,
  saveDailyStudyPlanAssignment,
  saveWeeklyStudyPlanAssignment,
} from "@/services/calendar";

import {
  getStudyTaskProgress,
} from "@/services/studyTaskProgressService";

import {
  getTopicProgress,
} from "@/services/topicService";

import {
  generateWeeklyStudyPlan,
} from "@/lib/study/weeklyPlanGenerator";

import type {
  StudyPlanMode,
} from "./types";

interface Options {
  uid: string;

  tasks:
    StudyTask[];

  dailyHours: number;

  alan:
    AlanOption | "";
  sinif: SinifOption | "";

  mode:
    StudyPlanMode;

  selectedDate: string;
}

export async function saveStudyPlanToCalendar({
  uid,
  tasks,
  dailyHours,
  alan,
  sinif,
  mode,
  selectedDate,
}: Options) {
  const startDate =
    parseCalendarDate(
      selectedDate
    );

  if (mode === "daily") {
    await saveDailyStudyPlanAssignment(
      uid,
      tasks,
      selectedDate,
      startDate
    );

    return;
  }

  const [
    progressMap,
    taskProgress,
    events,
  ] = await Promise.all([
    getTopicProgress(uid),

    getStudyTaskProgress(
      uid
    ),

    getCalendarEvents(
      uid
    ),
  ]);

  const excludedTaskIds =
    new Set<string>();

  for (
    const event
    of events
  ) {
    if (
      event.source !==
        "studyPlan" ||
      !event.studyTaskId
    ) {
      continue;
    }

    if (
      event.homeworkStatus ===
      "completed"
    ) {
      continue;
    }

    excludedTaskIds.add(
      event.studyTaskId
    );
  }

  const week =
    generateWeeklyStudyPlan({
      progressMap,
      dailyHours,
      alan,
      sinif,
      days: 7,
      taskProgress,
      excludedTaskIds,
    });

  await saveWeeklyStudyPlanAssignment(
    uid,
    week,
    selectedDate,
    startDate
  );
}
