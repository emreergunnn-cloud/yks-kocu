import {
  Award,
  BarChart2,
  BookOpen,
  ClipboardList,
  Flame,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

import {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

import type {
  SubjectProgressMap,
} from "@/services/topicService";

import type {
  AchievementBadge,
  AchievementSummary,
} from "./types";

interface Options {
  progressMap:
    SubjectProgressMap;

  examCount: number;

  longestStreak: number;
}

export function buildAchievementSummary({
  progressMap,
  examCount,
  longestStreak,
}: Options): AchievementSummary {
  const totalTopics =
    YKS_SUBJECTS.reduce(
      (total, subject) =>
        total +
        subject.topics.length,
      0
    );

  const totalCompleted =
    YKS_SUBJECTS.reduce(
      (total, subject) =>
        total +
        subject.topics.filter(
          (topic) =>
            progressMap[
              subject.id
            ]?.[
              topic.id
            ] ===
            "Tamamlandı"
        ).length,
      0
    );

  const topicPercent =
    totalTopics > 0
      ? Math.round(
          (
            totalCompleted /
            totalTopics
          ) * 100
        )
      : 0;

  const badges:
    AchievementBadge[] = [
      {
        id: "first_exam",
        icon:
          ClipboardList,
        title:
          "İlk Deneme",
        description:
          "İlk deneme sonucunu gir",
        earned:
          examCount >= 1,
      },

      {
        id: "five_exams",
        icon:
          BarChart2,
        title:
          "5 Deneme",
        description:
          "5 deneme sonucu gir",
        earned:
          examCount >= 5,
        progress:
          Math.min(
            examCount,
            5
          ),
        max: 5,
      },

      {
        id: "twenty_exams",
        icon:
          Trophy,
        title:
          "20 Deneme",
        description:
          "20 deneme sonucu gir",
        earned:
          examCount >= 20,
        progress:
          Math.min(
            examCount,
            20
          ),
        max: 20,
      },

      {
        id: "streak_3",
        icon:
          Flame,
        title:
          "Isınma Turu",
        description:
          "3 gün üst üste çalış",
        earned:
          longestStreak >= 3,
        progress:
          Math.min(
            longestStreak,
            3
          ),
        max: 3,
      },

      {
        id: "streak_7",
        icon:
          Flame,
        title:
          "Ateşli Öğrenci",
        description:
          "7 gün üst üste çalış",
        earned:
          longestStreak >= 7,
        progress:
          Math.min(
            longestStreak,
            7
          ),
        max: 7,
      },

      {
        id: "streak_14",
        icon:
          Flame,
        title:
          "Durmak Yok",
        description:
          "14 gün üst üste çalış",
        earned:
          longestStreak >= 14,
        progress:
          Math.min(
            longestStreak,
            14
          ),
        max: 14,
      },

      {
        id: "streak_30",
        icon:
          Flame,
        title:
          "Terminatör",
        description:
          "30 gün üst üste çalış",
        earned:
          longestStreak >= 30,
        progress:
          Math.min(
            longestStreak,
            30
          ),
        max: 30,
      },

      {
        id: "first_topic",
        icon:
          BookOpen,
        title:
          "Başlangıç",
        description:
          "İlk konuyu tamamla",
        earned:
          totalCompleted >= 1,
      },

      {
        id: "ten_topics",
        icon:
          Star,
        title:
          "10 Konu",
        description:
          "10 konu tamamla",
        earned:
          totalCompleted >= 10,
        progress:
          Math.min(
            totalCompleted,
            10
          ),
        max: 10,
      },

      {
        id: "fifty_topics",
        icon:
          Flame,
        title:
          "50 Konu",
        description:
          "50 konu tamamla",
        earned:
          totalCompleted >= 50,
        progress:
          Math.min(
            totalCompleted,
            50
          ),
        max: 50,
      },

      {
        id: "hundred_topics",
        icon:
          Award,
        title:
          "100 Konu",
        description:
          "100 konu tamamla",
        earned:
          totalCompleted >= 100,
        progress:
          Math.min(
            totalCompleted,
            100
          ),
        max: 100,
      },

      {
        id: "half_curriculum",
        icon:
          Target,
        title:
          "Yarı Yol",
        description:
          "Müfredatın %50'sini tamamla",
        earned:
          topicPercent >= 50,
        progress:
          Math.min(
            topicPercent,
            50
          ),
        max: 50,
      },

      {
        id: "full_curriculum",
        icon:
          TrendingUp,
        title:
          "Tüm Müfredat",
        description:
          "Tüm konuları tamamla",
        earned:
          topicPercent >= 100,
        progress:
          Math.min(
            topicPercent,
            100
          ),
        max: 100,
      },
    ];

  const earnedCount =
    badges.filter(
      (badge) =>
        badge.earned
    ).length;

  const xp =
    earnedCount * 100 +
    totalCompleted * 5 +
    examCount * 20;

  const level =
    Math.floor(
      xp / 500
    ) + 1;

  const levelXp =
    xp % 500;

  return {
    totalTopics,
    totalCompleted,
    topicPercent,
    examCount,
    earnedCount,
    xp,
    level,
    levelXp,
    badges,
  };
}
