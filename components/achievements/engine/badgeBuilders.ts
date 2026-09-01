import { Award, BarChart2, BookOpen, ClipboardList, Flame, Star, Target, TrendingUp, Trophy } from "lucide-react";
import type { AchievementBadge } from "../types";

export function buildExamBadges(examCount: number): AchievementBadge[] {
  return [
    { id: "first_exam", icon: ClipboardList, title: "İlk Deneme", description: "İlk deneme sonucunu gir", earned: examCount >= 1 },
    { id: "five_exams", icon: BarChart2, title: "5 Deneme", description: "5 deneme sonucu gir", earned: examCount >= 5, progress: Math.min(examCount, 5), max: 5 },
    { id: "twenty_exams", icon: Trophy, title: "20 Deneme", description: "20 deneme sonucu gir", earned: examCount >= 20, progress: Math.min(examCount, 20), max: 20 },
  ];
}

export function buildStreakBadges(longestStreak: number): AchievementBadge[] {
  const make = (id: string, title: string, days: number): AchievementBadge => ({
    id, icon: Flame, title, description: `${days} gün üst üste çalış`, earned: longestStreak >= days,
    progress: Math.min(longestStreak, days), max: days,
  });
  return [
    make("streak_3", "Isınma Turu", 3),
    make("streak_7", "Ateşli Öğrenci", 7),
    make("streak_14", "Durmak Yok", 14),
    make("streak_30", "Terminatör", 30),
  ];
}

export function buildTopicBadges(totalCompleted: number, topicPercent: number): AchievementBadge[] {
  return [
    { id: "first_topic", icon: BookOpen, title: "Başlangıç", description: "İlk konuyu tamamla", earned: totalCompleted >= 1 },
    { id: "ten_topics", icon: Star, title: "10 Konu", description: "10 konu tamamla", earned: totalCompleted >= 10, progress: Math.min(totalCompleted, 10), max: 10 },
    { id: "fifty_topics", icon: Flame, title: "50 Konu", description: "50 konu tamamla", earned: totalCompleted >= 50, progress: Math.min(totalCompleted, 50), max: 50 },
    { id: "hundred_topics", icon: Award, title: "100 Konu", description: "100 konu tamamla", earned: totalCompleted >= 100, progress: Math.min(totalCompleted, 100), max: 100 },
    { id: "half_curriculum", icon: Target, title: "Yarı Yol", description: "Müfredatın %50'sini tamamla", earned: topicPercent >= 50, progress: Math.min(topicPercent, 50), max: 50 },
    { id: "full_curriculum", icon: TrendingUp, title: "Tüm Müfredat", description: "Tüm konuları tamamla", earned: topicPercent >= 100, progress: Math.min(topicPercent, 100), max: 100 },
  ];
}
