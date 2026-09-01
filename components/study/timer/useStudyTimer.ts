"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTimerHistory } from "./hooks/useTimerHistory";
import { useTimerRuntime } from "./hooks/useTimerRuntime";
import { useTimerSetup } from "./hooks/useTimerSetup";

export function useStudyTimer() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const setup = useTimerSetup({
    uid: user?.uid ?? null,
    urlSubjectId: searchParams.get("subjectId"),
    urlTopicId: searchParams.get("topicId"),
    urlDuration: searchParams.get("duration"),
  });
  const history = useTimerHistory({ uid: user?.uid ?? null, subject: setup.subject, subjectId: setup.subjectId, topicId: setup.topicId, note: setup.note });
  const runtime = useTimerRuntime({ preset: setup.preset, setPreset: setup.setPreset, mode: setup.mode, setMode: setup.setMode, timeLeft: setup.timeLeft, setTimeLeft: setup.setTimeLeft, saveSession: history.saveSession });

  return {
    preset: setup.preset, mode: setup.mode, timeLeft: setup.timeLeft,
    isRunning: runtime.isRunning, cycleCount: runtime.cycleCount,
    stats: history.stats, recentSessions: history.recentSessions,
    subject: setup.subject, note: setup.note, error: history.error, saving: history.saving,
    successSession: history.successSession, setSubject: setup.setSubject, setNote: setup.setNote,
    changePreset: runtime.changePreset, changeMode: runtime.changeMode, toggleRunning: runtime.toggleRunning,
    reset: runtime.reset, skip: runtime.skip, closeSuccess: history.closeSuccess,
  };
}
