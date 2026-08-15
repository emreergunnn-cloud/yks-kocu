import type {
  CalendarEvent,
} from "@/services/calendar";

import {
  MONTH_NAMES,
  TYPE_CONFIG,
} from "./calendarConfig";

interface Props {
  events: CalendarEvent[];
  year: number;
  month: number;
}

export function CalendarMonthSummary({
  events,
  year,
  month,
}: Props) {
  const prefix =
    `${year}-${String(
      month + 1
    ).padStart(2, "0")}`;

  const monthEvents =
    events.filter(
      (event) =>
        event.date.startsWith(
          prefix
        )
    );

  return (
    <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4 space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase">
        {MONTH_NAMES[month]} Özeti
      </h3>

      {(
        [
          "study",
          "exam",
          "goal",
        ] as const
      ).map((type) => {
        const count =
          monthEvents.filter(
            (event) =>
              event.type === type
          ).length;

        return (
          <div
            key={type}
            className="flex items-center gap-2"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                TYPE_CONFIG[
                  type
                ].color
              }`}
            />

            <span className="flex-1 text-sm">
              {
                TYPE_CONFIG[
                  type
                ].label
              }
            </span>

            <strong>
              {count}
            </strong>
          </div>
        );
      })}

      <div className="border-t pt-2 flex justify-between text-xs">
        <span>
          Toplam Etkinlik
        </span>

        <strong>
          {monthEvents.length}
        </strong>
      </div>
    </div>
  );
}