"use client";

import { clearAllCalendarEvents, clearCalendarDay, createCalendarEvent, deleteCalendarEvent } from "@/services/calendar";
import type { CreateDayEventInput } from "../useCalendarController";

interface Options {
  uid: string | null;
  selectedDate: string | null;
  reload: () => Promise<void>;
}

function dispatchCalendarUpdate() {
  window.dispatchEvent(new Event("study-calendar-updated"));
}

export function useCalendarActions({ uid, selectedDate, reload }: Options) {
  const clearAll = async () => {
    if (!uid) return;
    await clearAllCalendarEvents(uid);
    dispatchCalendarUpdate();
    await reload();
  };

  const clearSelectedDay = async () => {
    if (!uid || !selectedDate) return;
    await clearCalendarDay(uid, selectedDate);
    dispatchCalendarUpdate();
    await reload();
  };

  const deleteEvent = async (eventId: string) => {
    if (!uid || eventId.startsWith("exam-")) return;
    await deleteCalendarEvent(uid, eventId);
    dispatchCalendarUpdate();
    await reload();
  };

  const createEvent = async (input: CreateDayEventInput) => {
    if (!uid || !selectedDate) return;
    await createCalendarEvent(uid, { date: selectedDate, ...input });
    await reload();
  };

  return { clearAll, clearSelectedDay, deleteEvent, createEvent };
}
