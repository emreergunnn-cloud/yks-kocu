"use client";

import {
  useState,
} from "react";

import type {
  StudyTask,
} from "@/types/studyPlan";

import type {
  AlanOption,
} from "@/types/user";

import {
  addDailyStudyPlanToCalendar,
  addWeeklyStudyPlanToCalendar,
  formatCalendarDate,
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
}

export function useStudyPlanCalendarActions({
  uid,
  tasks,
  dailyHours,
  alan,
}: Options) {
  const [mode, setMode] =
    useState<StudyPlanMode>("daily");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function changeMode(newMode: StudyPlanMode) {
    if (saving) return;

    setMode(newMode);
    setSaved(false);
    setError(null);
  }

  async function save() {
    if (!tasks.length || saving) return;

    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const today = new Date();

      await saveStudyPlan(
        uid,
        mode,
        formatCalendarDate(today),
        tasks.map((task) => task.id)
      );

      if (mode === "daily") {
        await addDailyStudyPlanToCalendar(
          uid,
          tasks,
          today
        );
      } else {
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
          today
        );
      }

      setSaved(true);
    } catch (saveError) {
      console.error(saveError);

      setError(
        "Plan takvime eklenirken bir hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    mode,
    saving,
    saved,
    error,
    totalDailyMinutes: Math.round(dailyHours * 60),
    changeMode,
    save,
  };
}