"use client";

import { useEffect, useState } from "react";
import { YKS_SUBJECTS } from "@/lib/constants/subjects";
import { getUserSettings } from "@/services/settingsService";
import { PRESETS } from "../constants";
import type { PomodoroMode, Preset } from "../types";

interface Options { uid: string | null; urlSubjectId: string | null; urlTopicId: string | null; urlDuration: string | null; }

export function useTimerSetup({ uid, urlSubjectId, urlTopicId, urlDuration }: Options) {
  const [preset, setPreset] = useState<Preset>(PRESETS[0]);
  const [mode, setMode] = useState<PomodoroMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(PRESETS[0].work * 60);
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");

  useEffect(() => {
    setSubjectId(urlSubjectId ?? "");
    setTopicId(urlTopicId ?? "");
    if (urlSubjectId && urlTopicId) {
      const foundSubject = YKS_SUBJECTS.find((item) => item.id === urlSubjectId);
      const foundTopic = foundSubject?.topics.find((item) => item.id === urlTopicId);
      if (foundSubject && foundTopic) setSubject(`${foundSubject.name} - ${foundTopic.name}`);
    }
    if (!urlDuration) return;
    const minutes = Number.parseInt(urlDuration, 10);
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    const existing = PRESETS.find((item) => item.work === minutes);
    const nextPreset: Preset = existing ?? { label: `${minutes} Dk`, work: minutes, short: 5, long: 15 };
    setPreset(nextPreset); setMode("pomodoro"); setTimeLeft(nextPreset.work * 60);
  }, [urlSubjectId, urlTopicId, urlDuration]);

  useEffect(() => {
    if (!uid || urlDuration) return;
    const userId = uid;
    let active = true;
    async function load() {
      const settings = await getUserSettings(userId);
      if (!active) return;
      const matchingPreset = PRESETS.find((item) => item.work === settings.pomodoroLength);
      const nextPreset: Preset = {
        label: matchingPreset?.label ?? `${settings.pomodoroLength} Dk`,
        work: settings.pomodoroLength,
        short: settings.breakLength,
        long: settings.longBreakLength,
      };
      setPreset(nextPreset); setMode("pomodoro"); setTimeLeft(nextPreset.work * 60);
    }
    void load();
    return () => { active = false; };
  }, [uid, urlDuration]);

  return { preset, setPreset, mode, setMode, timeLeft, setTimeLeft, subject, setSubject, note, setNote, subjectId, topicId };
}
