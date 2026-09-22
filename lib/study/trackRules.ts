import type { SubjectWithTopics } from "@/lib/constants/subjects";
import type { AlanOption } from "@/types/user";

export type StudySubject = SubjectWithTopics;

export function isSubjectAllowedForTrack(
  subject: StudySubject,
  alan: AlanOption | ""
): boolean {
  if (subject.category !== "AYT") {
    return true;
  }

  if (!alan) {
    return true;
  }

  const allowedTracks =
    "allowedTracks" in subject
      ? subject.allowedTracks
      : undefined;

  if (!allowedTracks?.length) {
    return true;
  }

  return allowedTracks.some(
    (track) => track === alan
  );
}