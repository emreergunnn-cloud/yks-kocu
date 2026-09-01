import type { CalendarEvent } from "@/services/calendar";
import { formatCalendarDate } from "@/services/calendar";
import { TYPE_CONFIG } from "../calendarConfig";

interface Props { day: Date; selectedDate: string | null; today: string; events: CalendarEvent[]; onSelect: (date: string) => void; }

export function CalendarDayCell({ day, selectedDate, today, events, onSelect }: Props) {
  const date = formatCalendarDate(day);
  return (
    <button onClick={() => onSelect(date)} className={`min-h-[68px] border-b border-r p-1.5 text-left ${selectedDate === date ? "bg-blue-50 dark:bg-blue-950/40" : ""}`}>
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${today === date ? "bg-blue-600 text-white" : ""}`}>{day.getDate()}</span>
      <div className="mt-1 space-y-0.5">
        {events.slice(0, 2).map((event) => <div key={event.id} className={`h-1.5 rounded-full ${TYPE_CONFIG[event.type].color}`} />)}
        {events.length > 2 && <span className="text-[9px] text-slate-400">+{events.length - 2}</span>}
      </div>
    </button>
  );
}
