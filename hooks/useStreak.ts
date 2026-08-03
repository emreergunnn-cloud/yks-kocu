"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getStreakData,
  recordStudyActivity,
  StreakData,
} from "../services/streakService";
import { useAuth } from "../context/AuthContext";

interface UseStreakReturn {
  streak: StreakData | null;
  loading: boolean;
  error: string | null;
  /** Call this after a study session or topic completion to record activity */
  recordActivity: () => Promise<StreakData | null>;
  /** Manually refresh streak data from Firestore */
  refresh: () => Promise<void>;
}

/**
 * React hook that loads and manages streak data for the currently authenticated user.
 *
 * Usage:
 *   const { streak, loading, recordActivity } = useStreak();
 */
export function useStreak(): UseStreakReturn {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStreak = useCallback(async () => {
    if (!user?.uid) {
      setStreak(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getStreakData(user.uid);
      setStreak(data);
    } catch (err) {
      setError("Seri verisi yüklenemedi.");
      console.error("[useStreak] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadStreak();
  }, [loadStreak]);

  const recordActivity = useCallback(async (): Promise<StreakData | null> => {
    if (!user?.uid) return null;
    try {
      const updated = await recordStudyActivity(user.uid);
      setStreak(updated);
      return updated;
    } catch (err) {
      console.error("[useStreak] record error:", err);
      return null;
    }
  }, [user?.uid]);

  const refresh = useCallback(async (): Promise<void> => {
    await loadStreak();
  }, [loadStreak]);

  return { streak, loading, error, recordActivity, refresh };
}
