"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getExamResults } from "@/services/examService";
import { getCalendarEvents, type CalendarEvent } from "@/services/calendar";
import { TYPE_CONFIG } from "../../calendarConfig";

export function useCalendarEvents(uid: string | null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!uid) {
      setEvents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [calendarEvents, exams] = await Promise.all([
        getCalendarEvents(uid),
        getExamResults(uid, 200),
      ]);
      const examEvents: CalendarEvent[] = exams
        .filter((exam) => exam.sinavTarihi)
        .map((exam) => ({
          id: `exam-${exam.id}`,
          date: exam.sinavTarihi!,
          title: `${exam.denemeTipi} Denemesi`,
          type: "exam",
          color: TYPE_CONFIG.exam.color,
        }));
      setEvents([...calendarEvents, ...examEvents]);
    } catch (error) {
      console.error("Takvim verileri alınamadı:", error);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { void load(); }, [load]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const event of events) {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    }
    return map;
  }, [events]);

  return { events, loading, eventsByDate, load };
}
