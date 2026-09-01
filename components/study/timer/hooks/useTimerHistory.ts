"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getRecentStudySessions } from "@/services/studyService";
import { getStudyStats, type StudyStats } from "@/services/studyStatsService";
import { completeStudySession } from "@/services/studySessionCompletionService";
import type { RecentTimerSession } from "../types";

const EMPTY_STATS: StudyStats = { todayMinutes: 0, weekMinutes: 0, monthMinutes: 0, todaySessions: 0, weekSessions: 0, monthSessions: 0 };
interface Options { uid: string | null; subject: string; subjectId: string; topicId: string; note: string; }

export function useTimerHistory({ uid, subject, subjectId, topicId, note }: Options) {
  const [stats, setStats] = useState<StudyStats>(EMPTY_STATS);
  const [recentSessions, setRecentSessions] = useState<RecentTimerSession[]>([]);
  const [successSession, setSuccessSession] = useState<RecentTimerSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  const refreshHistory = useCallback(async () => {
    if (!uid) { setStats(EMPTY_STATS); setRecentSessions([]); return; }
    const [nextStats, sessions] = await Promise.all([getStudyStats(uid), getRecentStudySessions(uid)]);
    setStats(nextStats);
    setRecentSessions(sessions.slice(0, 5).map((session) => ({ subject: session.subject, duration: session.duration, ts: session.endTime.toDate() })));
  }, [uid]);

  useEffect(() => { void refreshHistory(); }, [refreshHistory]);

  const saveSession = useCallback(async (seconds: number) => {
    if (!uid || seconds <= 0 || savingRef.current) return;
    savingRef.current = true; setSaving(true); setError(null);
    try {
      const saved = await completeStudySession({ uid, subject: subject || "Genel", duration: seconds, subjectId: subjectId || undefined, topicId: topicId || undefined, note: note || undefined });
      setSuccessSession({ subject: subject || "Genel", duration: seconds, ts: saved.endTime.toDate() });
      await refreshHistory();
    } catch (saveError) {
      console.error(saveError); setError("Çalışma seansı kaydedilemedi.");
    } finally {
      savingRef.current = false; setSaving(false);
    }
  }, [uid, subject, subjectId, topicId, note, refreshHistory]);

  return { stats, recentSessions, successSession, error, saving, saveSession, closeSuccess: () => setSuccessSession(null) };
}
