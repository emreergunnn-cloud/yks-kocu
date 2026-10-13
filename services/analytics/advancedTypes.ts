import type { SectionAverage } from "./types";

export interface YksAdvancedAnalytics {
  tytChange: number | null;
  aytChange: number | null;
  strongestSection: SectionAverage | null;
  prioritySection: SectionAverage | null;
  targetGap: number | null;
  recentExamCount: number;
}
