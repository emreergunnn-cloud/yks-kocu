"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveUserSettings } from "@/services/settingsService";
import { PRESETS } from "../constants";
import type { Preset } from "../types";

type DurationKey = "work" | "short" | "long";

interface Options {
  preset: Preset;
  onApply: (preset: Preset) => void;
}

export function usePomodoroSettings({ preset, onApply }: Options) {
  const { user } = useAuth();
  const [values, setValues] = useState(preset);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setValues(preset), [preset]);

  function update(key: DurationKey, value: number) {
    setSaved(false);
    setValues((previous) => ({ ...previous, [key]: value, label: "Özel" }));
  }

  function applyPreset(nextPreset: Preset) {
    setValues(nextPreset);
    setSaved(false);
    onApply(nextPreset);
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    setError("");

    try {
      const matching = PRESETS.find(
        (item) => item.work === values.work && item.short === values.short && item.long === values.long
      );
      const nextPreset = { ...values, label: matching?.label ?? "Özel" };
      onApply(nextPreset);
      await saveUserSettings(user.uid, {
        pomodoroLength: values.work,
        breakLength: values.short,
        longBreakLength: values.long,
      });
      setSaved(true);
    } catch (saveError) {
      console.error(saveError);
      setError("Pomodoro süreleri kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  return { values, saving, saved, error, update, applyPreset, save };
}
