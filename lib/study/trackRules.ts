import type { YKS_SUBJECTS } from "@/lib/constants/subjects";
import type { AlanOption } from "@/types/user";

export type YksSubject =
  (typeof YKS_SUBJECTS)[number];

export function isSubjectAllowedForTrack(
  subject: YksSubject,
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