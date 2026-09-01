"use client";

import { CountdownCard } from "./yks-countdown/CountdownCard";
import { CountdownEmptyState } from "./yks-countdown/CountdownEmptyState";
import { useYksCountdown } from "./yks-countdown/useYksCountdown";

export function YksCountdown() {
  const { targetDate, year, source, timeLeft } = useYksCountdown();
  if (!year) return <div className="min-h-[140px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />;
  if (!targetDate) return <CountdownEmptyState year={year} />;
  if (!timeLeft) return null;
  return <CountdownCard year={year} source={source} timeLeft={timeLeft} />;
}
