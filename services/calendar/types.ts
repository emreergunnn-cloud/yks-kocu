import type {
  StudyTaskType,
} from "@/types/studyPlan";

export type CalendarEventType =
  | "exam"
  | "study"
  | "goal";

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: CalendarEventType;
  color: string;

  notes?: string;
  durationMinutes?: number;
  source?: string;

  subjectId?: string;
  topicId?: string;

  studyTaskId?: string;
  studyTaskType?: StudyTaskType;
}

export interface CreateCalendarEventInput {
  date: string;
  title: string;

  type?:
    | "study"
    | "goal";

  notes?: string;
  durationMinutes?: number;
}