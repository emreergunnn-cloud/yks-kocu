import type {
  LucideIcon,
} from "lucide-react";

export interface AchievementBadge {
  id: string;

  icon:
    LucideIcon;

  title: string;

  description: string;

  earned: boolean;

  progress?: number;

  max?: number;
}

export interface AchievementSummary {
  totalTopics: number;

  totalCompleted: number;

  topicPercent: number;

  examCount: number;

  earnedCount: number;

  xp: number;

  level: number;

  levelXp: number;

  badges:
    AchievementBadge[];
}
