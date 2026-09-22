import type { SubjectWithTopics } from "@/lib/constants/subjects";
import type { SubjectProgressMap } from "@/services/topicService";
import type { AchievementSummary } from "./types";
import { buildExamBadges, buildStreakBadges, buildTopicBadges } from "./engine/badgeBuilders";
import { getTopicStats } from "./engine/progressStats";

interface Options {
  progressMap: SubjectProgressMap;
  examCount: number;
  longestStreak: number;
  subjects?: readonly SubjectWithTopics[];
}

export function buildAchievementSummary({ progressMap, examCount, longestStreak, subjects }: Options): AchievementSummary {
  const { totalTopics, totalCompleted, topicPercent } = getTopicStats(progressMap, subjects);
  const badges = [
    ...buildExamBadges(examCount),
    ...buildStreakBadges(longestStreak),
    ...buildTopicBadges(totalCompleted, topicPercent),
  ];
  const earnedCount = badges.filter((badge) => badge.earned).length;
  const xp = earnedCount * 100 + totalCompleted * 5 + examCount * 20;
  const level = Math.floor(xp / 500) + 1;
  const levelXp = xp % 500;
  return { totalTopics, totalCompleted, topicPercent, examCount, earnedCount, xp, level, levelXp, badges };
}
