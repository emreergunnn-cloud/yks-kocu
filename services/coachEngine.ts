import { UserProfile } from "@/types/user";

export function calculateOBP(diplomaNotu: number): number {
  return diplomaNotu * 5;
}

export function calculateRequiredDailyStudy(
  targetNet: number,
  currentNet: number,
  daysLeft: number
): number {
  if (daysLeft <= 0) return 0;

  const remainingNet = Math.max(targetNet - currentNet, 0);

  // Şimdilik basit hesap
  return Number((remainingNet / daysLeft * 2).toFixed(1));
}

export function calculateWeeklyGoal(
  targetNet: number,
  currentNet: number,
  weeksLeft: number
): number {
  if (weeksLeft <= 0) return 0;

  return Number(((targetNet - currentNet) / weeksLeft).toFixed(2));
}

export function calculateTargetProgress(
  currentNet: number,
  targetNet: number
): number {
  if (targetNet <= 0) return 0;

  return Math.min(100, Math.round((currentNet / targetNet) * 100));
}

export function calculateWeakLessons(
  lessons: { lesson: string; net: number }[]
) {
  return lessons.sort((a, b) => a.net - b.net).slice(0, 3);
}

export function generateDailyTasks(user: UserProfile) {
  return [
    "30 Paragraf Sorusu",
    "20 Matematik Problemi",
    "1 Pomodoro",
    "Konu Tekrarı",
  ];
}

export function estimateExamScore(
  tyt: number,
  ayt: number,
  obp: number
): number {
  // Geçici formül
  return Math.round(tyt * 3 + ayt * 3 + obp * 0.12);
}