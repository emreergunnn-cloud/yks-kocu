"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { AppLayout } from "../../components/layout/AppLayout";
import { getExamResults } from "../../services/examService";
import { computeAnalyticsSummary } from "../../services/analyticsService";
import { ExamResult } from "../../types/exam";
import { YksCountdown } from "../../components/analytics/YksCountdown";
import { TrendLineChart } from "../../components/analytics/TrendLineChart";
import { SectionBarChart } from "../../components/analytics/SectionBarChart";
import { ProgressDonut } from "../../components/analytics/ProgressDonut";
import { GoalTracker } from "../../components/analytics/GoalTracker";
import { ExamCard } from "../../components/deneme/ExamCard";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getExamResults(user.uid)
        .then((data) => setExams(data))
        .catch((err) => console.error("Error loading dashboard exams:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const summary = useMemo(() => {
    return computeAnalyticsSummary(exams, userProfile);
  }, [exams, userProfile]);

  const recentExams = useMemo(() => {
    return exams.slice(0, 3);
  }, [exams]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Hoş Geldin, {userProfile?.adSoyad || user?.displayName || "Öğrenci"}
              </h1>
              {userProfile?.alan && <Badge variant="primary">{userProfile.alan}</Badge>}
              {userProfile?.sinif && <Badge variant="secondary">{userProfile.sinif}. Sınıf</Badge>}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hedef: <strong className="text-slate-700 dark:text-slate-200">{userProfile?.hedefUniversite || "Üniversite"} {userProfile?.hedefBolum || "Bölüm"}</strong>
              {userProfile?.hedefSiralama ? ` • Hedef Derece: #${userProfile.hedefSiralama}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/deneme/ekle"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium px-4 py-2.5 rounded-xl shadow-md transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Deneme Ekle
            </Link>
          </div>
        </div>

        {/* Countdown Banner */}
        <YksCountdown daysRemaining={summary.daysRemainingToYks} />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <span className="text-xs text-slate-500 font-medium">Toplam Deneme</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {summary.totalExams} <span className="text-xs font-normal text-slate-400">Adet</span>
            </p>
          </Card>
          <Card className="p-5">
            <span className="text-xs text-slate-500 font-medium">Ortalama TYT Net</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {summary.avgTytNet} <span className="text-xs font-normal text-slate-400">/ 120 (Max: {summary.maxTytNet})</span>
            </p>
          </Card>
          <Card className="p-5">
            <span className="text-xs text-slate-500 font-medium">Ortalama AYT Net</span>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {summary.avgAytNet} <span className="text-xs font-normal text-slate-400">/ 80 (Max: {summary.maxAytNet})</span>
            </p>
          </Card>
          <Card className="p-5">
            <span className="text-xs text-slate-500 font-medium">Genel Net Ortalaması</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {summary.avgToplamNet} <span className="text-xs font-normal text-slate-400">Net</span>
            </p>
          </Card>
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Trend Line Chart (2 Cols) */}
          <Card className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  TYT & AYT Net Gelişim Trendi
                </h3>
                <p className="text-xs text-slate-500">Zaman içindeki deneme netlerinizin değişimi</p>
              </div>
              <Link href="/analytics" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Detaylı Analiz &rarr;
              </Link>
            </div>

            {loading ? <LoadingSpinner /> : <TrendLineChart data={summary.trendData} />}
          </Card>

          {/* Goal Progress Donut */}
          <Card className="space-y-4 flex flex-col justify-between">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hedef Sıralama Ulaşımı
              </h3>
              <p className="text-xs text-slate-500">Tahmini gerekli toplam net seviyesi</p>
            </div>

            <div className="py-4">
              <ProgressDonut percentage={summary.targetProgressPercentage} label={`Hedef: ~${summary.estimatedTargetNet} Net`} />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl text-xs space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">En Yüksek Toplam Net:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {summary.maxTytNet + summary.maxAytNet} Net
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Tahmini Hedef Net:</span>
                <span className="font-bold text-blue-600">{summary.estimatedTargetNet} Net</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Section Averages & Goal Tracker Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Breakdown Bar Chart */}
          <Card className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Bölüm Bazlı Net Ortalamaları
              </h3>
              <p className="text-xs text-slate-500">Güçlü ve geliştirilmesi gereken dersleriniz</p>
            </div>
            {loading ? <LoadingSpinner /> : <SectionBarChart data={summary.sectionAverages} />}
          </Card>

          {/* Goal Tracker Widget */}
          <Card className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Çalışma Hedefleri & İlerleme
              </h3>
              <p className="text-xs text-slate-500">Günlük, haftalık ve aylık çalışma hedefleriniz</p>
            </div>
            <GoalTracker />
          </Card>
        </div>

        {/* Recent Exams Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Son Girilen Deneme Sınavları
            </h2>
            <Link
              href="/deneme"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Tüm Denemeleri Gör ({exams.length}) &rarr;
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : recentExams.length === 0 ? (
            <Card className="p-8 text-center text-slate-500 text-sm">
              Henüz deneme sınavı girilmedi. İlk denemenizi ekleyerek gelişiminizi takip edin!
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recentExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
