"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type {
  CalendarEvent,
} from "@/services/calendar";

import {
  formatCalendarDate,
} from "@/services/calendar";

import {
  MONTH_NAMES,
  TYPE_CONFIG,
  WEEKDAY_LABELS,
} from "./calendarConfig";

interface Props {
  year: number;
  month: number;
  selectedDate: string | null;

  eventsByDate:
    Record<string, CalendarEvent[]>;

  onSelect:
    (date: string) => void;

  onPreviousMonth:
    () => void;

  onNextMonth:
    () => void;
}

function getMonthGrid(
  year: number,
  month: number
): Array<Date | null> {
  const first =
    new Date(
      year,
      month,
      1
    );

  const result:
    Array<Date | null> = [];

  const offset =
    (first.getDay() + 6) % 7;

  for (
    let index = 0;
    index < offset;
    index++
  ) {
    result.push(null);
  }

  const cursor =
    new Date(first);

  while (
    cursor.getMonth() === month
  ) {
    result.push(
      new Date(cursor)
    );

    cursor.setDate(
      cursor.getDate() + 1
    );
  }

  while (
    result.length % 7 !== 0
  ) {
    result.push(null);
  }

  return result;
}

export function CalendarGrid({
  year,
  month,
  selectedDate,
  eventsByDate,
  onSelect,
  onPreviousMonth,
  onNextMonth,
}: Props) {
  const grid =
    getMonthGrid(
      year,
      month
    );

  const today =
    formatCalendarDate(
      new Date()
    );

  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <button
          onClick={onPreviousMonth}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="font-bold">
          {MONTH_NAMES[month]}{" "}
          {year}
        </h2>

        <button
          onClick={onNextMonth}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b">
        {WEEKDAY_LABELS.map(
          (label) => (
            <div
              key={label}
              className="py-2.5 text-center text-[11px] font-bold text-slate-400"
            >
              {label}
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-7">
        {grid.map(
          (day, index) => {
            if (!day) {
              return (
                <div
                  key={index}
                  className="min-h-[68px] border-b border-r"
                />
              );
            }

            const date =
              formatCalendarDate(
                day
              );

            const events =
              eventsByDate[
                date
              ] ?? [];

            return (
              <button
                key={date}
                onClick={() =>
                  onSelect(date)
                }
                className={`min-h-[68px] p-1.5 text-left border-b border-r ${
                  selectedDate === date
                    ? "bg-blue-50 dark:bg-blue-950/40"
                    : ""
                }`}
              >
                <span
                  className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-semibold ${
                    today === date
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                >
                  {day.getDate()}
                </span>

                <div className="space-y-0.5 mt-1">
                  {events
                    .slice(0, 2)
                    .map(
                      (event) => (
                        <div
                          key={event.id}
                          className={`h-1.5 rounded-full ${
                            TYPE_CONFIG[
                              event.type
                            ].color
                          }`}
                        />
                      )
                    )}

                  {events.length >
                    2 && (
                    <span className="text-[9px] text-slate-400">
                      +
                      {events.length -
                        2}
                    </span>
                  )}
                </div>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}