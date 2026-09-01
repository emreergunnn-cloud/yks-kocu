"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "@/services/calendar";
import { formatCalendarDate } from "@/services/calendar";
import { MONTH_NAMES, WEEKDAY_LABELS } from "./calendarConfig";
import { CalendarDayCell } from "./grid/CalendarDayCell";
import { getMonthGrid } from "./grid/utils";

interface Props {
  year: number;
  month: number;
  selectedDate: string | null;
  eventsByDate: Record<string, CalendarEvent[]>;
  onSelect: (date: string) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarGrid({ year, month, selectedDate, eventsByDate, onSelect, onPreviousMonth, onNextMonth }: Props) {
  const grid = getMonthGrid(year, month);
  const today = formatCalendarDate(new Date());
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <button onClick={onPreviousMonth}><ChevronLeft className="h-5 w-5" /></button>
        <h2 className="font-bold">{MONTH_NAMES[month]} {year}</h2>
        <button onClick={onNextMonth}><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="grid grid-cols-7 border-b">{WEEKDAY_LABELS.map((label) => <div key={label} className="py-2.5 text-center text-[11px] font-bold text-slate-400">{label}</div>)}</div>
      <div className="grid grid-cols-7">
        {grid.map((day, index) => day ? <CalendarDayCell key={formatCalendarDate(day)} day={day} selectedDate={selectedDate} today={today} events={eventsByDate[formatCalendarDate(day)] ?? []} onSelect={onSelect} /> : <div key={index} className="min-h-[68px] border-b border-r" />)}
      </div>
    </div>
  );
}
