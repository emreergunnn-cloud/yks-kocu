"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCalendarActions } from "./controller/useCalendarActions";
import { useCalendarEvents } from "./controller/useCalendarEvents";
import { useCalendarMonth } from "./controller/useCalendarMonth";

export interface CreateDayEventInput {
  title: string;
  type: "study" | "goal";
  notes: string;
  durationMinutes: number;
}

export function useCalendarController() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const monthState = useCalendarMonth();
  const { events, loading, eventsByDate, load } = useCalendarEvents(uid);
  const selectedEvents = selectedDate ? eventsByDate[selectedDate] ?? [] : [];
  const actions = useCalendarActions({ uid, selectedDate, reload: load });

  return {
    uid,
    ...monthState,
    events,
    eventsByDate,
    selectedDate,
    selectedEvents,
    loading,
    setSelectedDate,
    ...actions,
  };
}
