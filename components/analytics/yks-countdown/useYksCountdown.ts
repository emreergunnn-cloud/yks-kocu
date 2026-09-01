"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserSettings } from "@/services/settingsService";
import {
  resolveYksDate,
  syncNativeYksWidget,
  type YksDateSource,
} from "@/services/yksDateService";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference % 86400000) / 3600000),
    minutes: Math.floor((difference % 3600000) / 60000),
    seconds: Math.floor((difference % 60000) / 1000),
  };
}

export function useYksCountdown() {
  const { user } = useAuth();

  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [source, setSource] = useState<YksDateSource>("none");
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!user) return;

    const uid = user.uid;
    let active = true;

    async function load() {
      const settings = await getUserSettings(uid);
      const resolved = await resolveYksDate(settings);

      if (!active) return;

      setYear(resolved.year);
      setTargetDate(resolved.date);
      setSource(resolved.source);

      await syncNativeYksWidget(resolved);
    }

    void load();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    const calculate = () => {
      setTimeLeft(calculateTimeLeft(targetDate));
    };

    calculate();

    const timer = window.setInterval(calculate, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [targetDate]);

  return {
    targetDate,
    year,
    source,
    timeLeft,
  };
}