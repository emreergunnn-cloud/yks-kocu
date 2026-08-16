import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  AlanOption,
} from "@/types/user";

import {
  addDailyStudyPlanToCalendar,
  addWeeklyStudyPlanToCalendar,
  parseCalendarDate,
} from "@/services/calendar";

import {
  saveStudyPlan,
} from "@/services/studyPlanService";

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
  tasks: StudyTask[];
  dailyHours: number;
  alan: AlanOption | "";

  mode: StudyPlanMode;
  selectedDate: string;
}

export async function saveStudyPlanToCalendar({
  uid,
  tasks,
  dailyHours,
  alan,
  mode,
  selectedDate,
}: Options) {
  const startDate =
    parseCalendarDate(selectedDate);

  await saveStudyPlan(
    uid,
    mode,
    selectedDate,
    tasks.map((task) => task.id)
  );

  if (mode === "daily") {
    await addDailyStudyPlanToCalendar(
      uid,
      tasks,
      startDate
    );

    return;
  }

  const progressMap =
    await getTopicProgress(uid);

  const week =
    generateWeeklyStudyPlan({
      progressMap,
      dailyHours,
      alan,
      days: 7,
    });

  await addWeeklyStudyPlanToCalendar(
    uid,
    week,
    startDate
  );
}