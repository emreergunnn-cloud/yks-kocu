"use client";

import {
  CalendarGrid,
} from "./CalendarGrid";

import {
  CalendarHeader,
} from "./CalendarHeader";

import {
  CalendarSidebar,
} from "./CalendarSidebar";

import {
  useCalendarController,
} from "./hooks/useCalendarController";

export function CalendarPage() {
  const calendar =
    useCalendarController();

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">
      <CalendarHeader
        onClear={
          calendar.clearAll
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CalendarGrid
          year={
            calendar.year
          }
          month={
            calendar.month
          }
          selectedDate={
            calendar.selectedDate
          }
          eventsByDate={
            calendar.eventsByDate
          }
          onSelect={
            calendar.setSelectedDate
          }
          onPreviousMonth={
            calendar.previousMonth
          }
          onNextMonth={
            calendar.nextMonth
          }
        />

        <CalendarSidebar
          uid={calendar.uid}
          selectedDate={
            calendar.selectedDate
          }
          selectedEvents={
            calendar.selectedEvents
          }
          events={
            calendar.events
          }
          year={
            calendar.year
          }
          month={
            calendar.month
          }
          loading={
            calendar.loading
          }
          onCloseDay={() =>
            calendar.setSelectedDate(
              null
            )
          }
          onCreate={
            calendar.createEvent
          }
          onDelete={
            calendar.deleteEvent
          }
          onClearDay={
            calendar.clearSelectedDay
          }
        />
      </div>
    </div>
  );
}