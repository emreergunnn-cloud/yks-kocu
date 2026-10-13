import type { ExamResult } from "@/types/exam";
import type { UserProfile } from "@/types/user";
import { includesAyt, includesTyt, sortExams } from "./examMetrics";
import { buildSectionAverages } from "./sectionMetrics";
import { estimateTargetNet } from "./targetMetrics";
import type { YksAdvancedAnalytics } from "./advancedTypes";

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function recentChange(values: number[]) {
  if (values.length < 2) return null;

  const recent = values.length >= 4 ? values.slice(-3) : values.slice(-1);
  const previous = values.length >= 4 ? values.slice(-6, -3) : values.slice(0, -1);
  if (!previous.length) return null;

  return Number((average(recent) - average(previous)).toFixed(1));
}

function latest(values: number[]) {
  return values.at(-1) ?? 0;
}

export function buildYksAdvancedAnalytics(
  exams: ExamResult[],
  profile: UserProfile
): YksAdvancedAnalytics {
  const sorted = sortExams(exams);
  const tytValues = sorted.filter(includesTyt).map((exam) => exam.tytToplamNet ?? 0);
  const aytValues = sorted.filter(includesAyt).map((exam) => exam.aytToplamNet ?? 0);
  const sections = buildSectionAverages(sorted, profile.alan);
  const ordered = [...sections].sort((a, b) => b.percentage - a.percentage);

  const targetTyt = Number(profile.targetTYT) || 0;
  const targetAyt = Number(profile.targetAYT) || 0;
  const explicitTarget = targetTyt + targetAyt;
  const target = explicitTarget > 0 ? explicitTarget : estimateTargetNet(profile);
  const current = latest(tytValues) + latest(aytValues);

  return {
    tytChange: recentChange(tytValues),
    aytChange: recentChange(aytValues),
    strongestSection: ordered[0] ?? null,
    prioritySection: ordered.at(-1) ?? null,
    targetGap: target > 0 ? Number(Math.max(0, target - current).toFixed(1)) : null,
    recentExamCount: Math.min(sorted.length, 6),
  };
}
