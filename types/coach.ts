export type CoachRisk = "Düşük" | "Orta" | "Yüksek";

export interface CoachTask {
  id: string;
  title: string;
  duration: number;
  priority: "high" | "medium" | "low";
}

export interface CoachInsight {
  type: "success" | "warning" | "info";
  title: string;
  description: string;
}

export interface CoachReport {
  targetProbability: number;
  risk: CoachRisk;

  targetTYT: number;
  targetAYT: number;

  strengths: string[];
  weaknesses: string[];

  insights: CoachInsight[];

  todayTasks: CoachTask[];

  coachMessage: string;
}