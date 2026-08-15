"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";

import { getExamResults } from "@/services/examService";

import {
  clearAllCalendarEvents,
  clearCalendarDay,
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents,
  type CalendarEvent,
} from "@/services/calendar";

import { TYPE_CONFIG } from "../calendarConfig";

export interface CreateDayEventInput {
  title: string;
  type: "study" | "goal";
  notes: string;
  durationMinutes: number;
}

export function useCalendarController() {
  const { user } = useAuth();

  const now = useMemo(
    () => new Date(),
    []
  );

  const [year, setYear] =
    useState(now.getFullYear());

  const [month, setMonth] =
    useState(now.getMonth());

  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);

  const [events, setEvents] =
    useState<CalendarEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const uid = user?.uid ?? null;

  const load = useCallback(async () => {
    if (!uid) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [
        calendarEvents,
        exams,
      ] = await Promise.all([
        getCalendarEvents(uid),
        getExamResults(uid, 200),
      ]);

      const examEvents: CalendarEvent[] =
        exams
          .filter(
            (exam) => exam.sinavTarihi
          )
          .map((exam) => ({
            id: `exam-${exam.id}`,
            date: exam.sinavTarihi!,
            title: `${exam.denemeTipi} Denemesi`,
            type: "exam",
            color:
              TYPE_CONFIG.exam.color,
          }));

      setEvents([
        ...calendarEvents,
        ...examEvents,
      ]);
    } catch (error) {
      console.error(
        "Takvim verileri alınamadı:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    void load();
  }, [load]);

  const eventsByDate =
    useMemo(() => {
      const map:
        Record<
          string,
          CalendarEvent[]
        > = {};

      for (const event of events) {
        if (!map[event.date]) {
          map[event.date] = [];
        }

        map[event.date].push(event);
      }

      return map;
    }, [events]);

  const selectedEvents =
    selectedDate
      ? eventsByDate[
          selectedDate
        ] ?? []
      : [];

  const previousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(
        (value) => value - 1
      );
      return;
    }

    setMonth(
      (value) => value - 1
    );
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(
        (value) => value + 1
      );
      return;
    }

    setMonth(
      (value) => value + 1
    );
  };

  const clearAll =
    async () => {
      if (!uid) return;

      await clearAllCalendarEvents(
        uid
      );

      await load();
    };

  const clearSelectedDay =
    async () => {
      if (
        !uid ||
        !selectedDate
      ) {
        return;
      }

      await clearCalendarDay(
        uid,
        selectedDate
      );

      await load();
    };

  const deleteEvent =
    async (
      eventId: string
    ) => {
      if (!uid) return;

      if (
        eventId.startsWith(
          "exam-"
        )
      ) {
        return;
      }

      await deleteCalendarEvent(
        uid,
        eventId
      );

      await load();
    };

  const createEvent =
    async (
      input:
        CreateDayEventInput
    ) => {
      if (
        !uid ||
        !selectedDate
      ) {
        return;
      }

      await createCalendarEvent(
        uid,
        {
          date:
            selectedDate,
          ...input,
        }
      );

      await load();
    };

  return {
    uid,
    year,
    month,
    events,
    eventsByDate,
    selectedDate,
    selectedEvents,
    loading,

    setSelectedDate,

    previousMonth,
    nextMonth,

    clearAll,
    clearSelectedDay,
    deleteEvent,
    createEvent,
  };
}