"use client";

import {
  Trophy,
} from "lucide-react";

import {
  buildAchievementSummary,
} from "./achievementEngine";

import {
  AchievementBadgeCard,
} from "./AchievementBadgeCard";

import {
  AchievementLevelCard,
} from "./AchievementLevelCard";

import {
  AchievementStats,
} from "./AchievementStats";

import {
  useAchievementsData,
} from "./useAchievementsData";

export function AchievementsPage() {
  const data =
    useAchievementsData();

  const summary =
    buildAchievementSummary({
      progressMap:
        data.progressMap,

      examCount:
        data.examCount,

      longestStreak:
        data.longestStreak,
    });

  if (data.loading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map(
          (item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
            />
          )
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <Trophy className="h-5 w-5 text-amber-500" />

          Başarılar
        </h1>

        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Meydan okuma ve rozetler
        </p>
      </div>

      <AchievementLevelCard
        level={
          summary.level
        }
        xp={summary.xp}
        levelXp={
          summary.levelXp
        }
      />

      <AchievementStats
        completedTopics={
          summary
            .totalCompleted
        }
        examCount={
          summary.examCount
        }
        earnedBadges={
          summary.earnedCount
        }
      />

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Rozetler
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {summary.badges.map(
            (badge) => (
              <AchievementBadgeCard
                key={
                  badge.id
                }
                badge={
                  badge
                }
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
