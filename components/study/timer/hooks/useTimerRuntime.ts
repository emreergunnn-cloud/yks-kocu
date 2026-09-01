"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getModeSeconds } from "../constants";
import type { PomodoroMode, Preset } from "../types";

interface Options {
  preset: Preset; setPreset: (preset: Preset) => void;
  mode: PomodoroMode; setMode: (mode: PomodoroMode) => void;
  timeLeft: number; setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  saveSession: (seconds: number) => Promise<void>;
}

export function useTimerRuntime({ preset, setPreset, mode, setMode, timeLeft, setTimeLeft, saveSession }: Options) {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const endAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    if (!endAtRef.current) endAtRef.current = Date.now() + timeLeft * 1000;
    const tick = () => {
      if (!endAtRef.current) return;
      const remaining = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining > 0) return;
      endAtRef.current = null; setIsRunning(false);
      if (mode === "pomodoro") {
        setCycleCount((value) => value + 1);
        void saveSession(getModeSeconds(preset, "pomodoro"));
      }
    };
    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [isRunning, mode, preset, timeLeft, setTimeLeft, saveSession]);

  const changeMode = useCallback((nextMode: PomodoroMode) => {
    endAtRef.current = null; setIsRunning(false); setMode(nextMode); setTimeLeft(getModeSeconds(preset, nextMode));
  }, [preset, setMode, setTimeLeft]);

  const changePreset = useCallback((nextPreset: Preset) => {
    endAtRef.current = null; setIsRunning(false); setPreset(nextPreset); setMode("pomodoro"); setTimeLeft(nextPreset.work * 60);
  }, [setPreset, setMode, setTimeLeft]);

  const toggleRunning = useCallback(() => {
    if (isRunning) {
      if (endAtRef.current) setTimeLeft(Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000)));
      endAtRef.current = null; setIsRunning(false); return;
    }
    if (timeLeft <= 0) return;
    endAtRef.current = Date.now() + timeLeft * 1000; setIsRunning(true);
  }, [isRunning, timeLeft, setTimeLeft]);

  const reset = useCallback(() => {
    endAtRef.current = null; setIsRunning(false); setTimeLeft(getModeSeconds(preset, mode));
  }, [preset, mode, setTimeLeft]);

  const skip = useCallback(() => {
    if (mode === "pomodoro") {
      const elapsed = getModeSeconds(preset, "pomodoro") - timeLeft;
      if (elapsed > 60) void saveSession(elapsed);
      const longBreak = cycleCount > 0 && cycleCount % 4 === 0;
      changeMode(longBreak ? "long_break" : "short_break");
      return;
    }
    changeMode("pomodoro");
  }, [mode, preset, timeLeft, cycleCount, saveSession, changeMode]);

  return { isRunning, cycleCount, changePreset, changeMode, toggleRunning, reset, skip };
}
