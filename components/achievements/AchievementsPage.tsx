"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getTopicProgress, SubjectProgressMap, computeSubjectStats } from "../../services/topicService";
import { getExamResults } from "../../services/examService";
import { generateRecommendations, Recommendation } from "../../services/coachService";
import { YKS_SUBJECTS } from "../../lib/constants/subjects";
import { ExamResult } from "../../types/exam";
import { Trophy, Star, Flame, Target, BookOpen, ClipboardList, BarChart2, TrendingUp, Lightbulb, ChevronRight, Award } from "lucide-react";
import Link from "next/link";

export const AchievementsPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [progressMap, setProgressMap] = useState<SubjectProgressMap>({});
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getTopicProgress(user.uid),
      getExamResults(user.uid, 100),
    ]).then(([pm, ex]) => {
      setProgressMap(pm);
      setExams(ex);
      const subjectsForCoach = YKS_SUBJECTS.map((s) => ({ id: s.id, name: s.name, topics: s.topics }));
      setRecs(generateRecommendations(ex, pm, subjectsForCoach));
      setLoading(false);
    });
  }, [user]);

  // Compute stats
  const totalTopics = YKS_SUBJECTS.reduce((acc, s) => acc + s.topics.length, 0);
  const totalCompleted = YKS_SUBJECTS.reduce((acc, s) =>
    acc + s.topics.filter((t) => progressMap[s.id]?.[t.id] === "Tamamlandı").length, 0);
  const topicPct = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  interface Badge {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    earned: boolean;
    progress?: number;
    max?: number;
  }

  const badges: Badge[] = [
    {
      id: "first_exam",
      icon: <ClipboardList className="w-5 h-5" />,
      title: "İlk Deneme",
      description: "İlk deneme sonucunu gir",
      earned: exams.length >= 1,
    },
    {
      id: "five_exams",
      icon: <BarChart2 className="w-5 h-5" />,
      title: "5 Deneme",
      description: "5 deneme sonucu gir",
      earned: exams.length >= 5,
      progress: Math.min(exams.length, 5),
      max: 5,
    },
    {
      id: "twenty_exams",
      icon: <Trophy className="w-5 h-5" />,
      title: "20 Deneme",
      description: "20 deneme sonucu gir",
      earned: exams.length >= 20,
      progress: Math.min(exams.length, 20),
      max: 20,
    },
    {
      id: "first_topic",
      icon: <BookOpen className="w-5 h-5" />,
      title: "Başlangıç",
      description: "İlk konuyu tamamla",
      earned: totalCompleted >= 1,
    },
    {
      id: "ten_topics",
      icon: <Star className="w-5 h-5" />,
      title: "10 Konu",
      description: "10 konu tamamla",
      earned: totalCompleted >= 10,
      progress: Math.min(totalCompleted, 10),
      max: 10,
    },
    {
      id: "fifty_topics",
      icon: <Flame className="w-5 h-5" />,
      title: "50 Konu",
      description: "50 konu tamamla",
      earned: totalCompleted >= 50,
      progress: Math.min(totalCompleted, 50),
      max: 50,
    },
    {
      id: "hundred_topics",
      icon: <Award className="w-5 h-5" />,
      title: "100 Konu",
      description: "100 konu tamamla",
      earned: totalCompleted >= 100,
      progress: Math.min(totalCompleted, 100),
      max: 100,
    },
    {
      id: "half_curriculum",
      icon: <Target className="w-5 h-5" />,
      title: "Yarı Yol",
      description: "Müfredatın %50'sini tamamla",
      earned: topicPct >= 50,
      progress: topicPct,
      max: 50,
    },
    {
      id: "full_curriculum",
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Tüm Müfredat",
      description: "Tüm konuları tamamla",
      earned: topicPct >= 100,
      progress: topicPct,
      max: 100,
    },
  ];

  const earnedCount = badges.filter((b) => b.earned).length;
  const xp = earnedCount * 100 + totalCompleted * 5 + exams.length * 20;
  const level = Math.floor(xp / 500) + 1;
  const levelXp = xp % 500;

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Başarılar
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Meydan okuma ve rozetler</p>
      </div>

      {/* XP / Level card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-xl shadow-blue-500/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Seviye</p>
            <p className="text-4xl font-black">{level}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Toplam XP</p>
            <p className="text-2xl font-black">{xp}</p>
          </div>
        </div>
        <div className="h-2 bg-blue-800/50 rounded-full overflow-hidden">
          <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: `${(levelXp / 500) * 100}%` }} />
        </div>
        <p className="text-xs text-blue-200 mt-1.5">{levelXp}/500 XP — Seviye {level + 1} için</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tamamlanan Konu", value: totalCompleted, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Deneme Sayısı", value: exams.length, color: "text-blue-600 dark:text-blue-400" },
          { label: "Kazanılan Rozet", value: earnedCount, color: "text-amber-600 dark:text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Rozetler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`bg-white dark:bg-slate-900 border rounded-xl p-4 space-y-2 transition-all ${badge.earned ? "border-amber-300 dark:border-amber-700 shadow-sm" : "border-slate-200 dark:border-slate-800 opacity-60"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badge.earned ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                {badge.icon}
              </div>
              <div>
                <p className={`text-sm font-semibold ${badge.earned ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                  {badge.title}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{badge.description}</p>
              </div>
              {badge.max && !badge.earned && (
                <div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${((badge.progress ?? 0) / badge.max) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{badge.progress ?? 0}/{badge.max}</p>
                </div>
              )}
              {badge.earned && <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold"><Star className="w-3 h-3" />Kazanıldı</span>}
            </div>
          ))}
        </div>
      </div>

      {/* AI Coach Recommendations */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" /> Koç Önerileri
        </h2>
        <div className="space-y-2">
          {recs.map((rec) => (
            <div key={rec.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                rec.type === "study" ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600" :
                rec.type === "revision" ? "bg-violet-100 dark:bg-violet-900/50 text-violet-600" :
                rec.type === "exam" ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600" :
                "bg-amber-100 dark:bg-amber-900/50 text-amber-600"
              }`}>
                {rec.type === "study" ? <BookOpen className="w-4 h-4" /> :
                 rec.type === "revision" ? <TrendingUp className="w-4 h-4" /> :
                 rec.type === "exam" ? <ClipboardList className="w-4 h-4" /> :
                 <Star className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{rec.subject}</span>
                  {rec.topic && <span className="text-xs text-slate-400">· {rec.topic}</span>}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${rec.priority === "Yüksek" ? "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400" : rec.priority === "Orta" ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{rec.reason}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 italic">"{rec.motivationSentence}"</p>
                {rec.estimatedMinutes > 0 && (
                  <p className="text-[10px] text-slate-400 mt-1">Tahmini süre: {rec.estimatedMinutes} dk • {rec.difficulty}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
