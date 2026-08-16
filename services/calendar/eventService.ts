import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import type {
  CalendarEvent,
  CreateCalendarEventInput,
} from "./types";

export async function getCalendarEvents(
  uid: string
): Promise<CalendarEvent[]> {
  const ref = collection(
    db,
    "users",
    uid,
    "calendarEvents"
  );

  const snapshot =
    await getDocs(ref);

  return snapshot.docs.map(
    (item) => ({
      id: item.id,

      ...(item.data() as Omit<
        CalendarEvent,
        "id"
      >),
    })
  );
}

export async function getStudyPlanBusyDates(
  uid: string
): Promise<Set<string>> {
  const events =
    await getCalendarEvents(uid);

  return new Set(
    events
      .filter(
        (event) =>
          event.source ===
          "studyPlan"
      )
      .map(
        (event) =>
          event.date
      )
  );
}

export async function createCalendarEvent(
  uid: string,
  event: CreateCalendarEventInput
) {
  const ref = collection(
    db,
    "users",
    uid,
    "calendarEvents"
  );

  const type =
    event.type ?? "study";

  return addDoc(ref, {
    date: event.date,
    title: event.title,
    type,

    color:
      type === "goal"
        ? "bg-emerald-500"
        : "bg-blue-500",

    notes:
      event.notes ?? "",

    durationMinutes:
      event.durationMinutes ??
      0,

    source: "manual",

    createdAt:
      Timestamp.now(),
  });
}

export async function deleteCalendarEvent(
  uid: string,
  eventId: string
) {
  await deleteDoc(
    doc(
      db,
      "users",
      uid,
      "calendarEvents",
      eventId
    )
  );
}