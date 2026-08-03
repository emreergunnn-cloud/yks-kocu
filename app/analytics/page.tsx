"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AppLayout } from "../../components/layout/AppLayout";
import { getExamResults } from "../../services/examService";
import { computeAnalyticsSummary } from "../../services/analyticsService";
import { ExamResult } from "../../types/exam";
import { TrendLineChart } from "../../components/analytics/TrendLineChart";
import { SectionBarChart } from "../../components/analytics/SectionBarChart";
import { ProgressDonut } from "../../components/analytics/ProgressDonut";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export default function AnalyticsPage() {
  const { user, userProfile } = useAuth();
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getExamResults(user.uid)
        .then((data) => setExams(data))
        .catch((err) => console.error("Error loading analytics exams:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const summary = useMemo(() => {
    return computeAnalyticsSummary(exams, userProfile);
  }, [exams, userProfile]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Performans & Detaylı İstatistikler
            </h1>
            <Badge variant="primary">Phase 3 Analytics</Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            TYT/AYT net trendleriniz, bölüm bazlı başarı yüzdeleriniz ve hedef analiziniz.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="İstatistikler hesaplanıyor..." />
        ) : (
          <>
            {/* Net Progression Trend Chart */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Zaman İçindeki Net Değişim Analizi
                  </h3>
                  <p className="text-xs text-slate-500">Mavi: TYT Netleri, Mor: AYT Netleri</p>
                </div>
              </div>
              <TrendLineChart data={summary.trendData} />
            </Card>

            {/* Grid Layout: Section Breakdown & Progress Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Section Performance Bar Chart (2 Cols) */}
              <Card className="lg:col-span-2 space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Ders Bazlı Başarı Başarı Yüzdeleri
                  </h3>
                  <p className="text-xs text-slate-500">Her ders için ortalama netleriniz ve doluluk yüzdesi</p>
                </div>
                <SectionBarChart data={summary.sectionAverages} />
              </Card>

              {/* Goal Reachability Card */}
              <Card className="space-y-6 flex flex-col justify-between">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Hedef Başarı Oranı
                  </h3>
                  <p className="text-xs text-slate-500">Mevcut performansınızın hedefinize oranı</p>
                </div>

                <ProgressDonut percentage={summary.targetProgressPercentage} size={150} />

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Hedef Derece:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {userProfile?.hedefSiralama ? `#${userProfile.hedefSiralama}` : "Belirtilmedi"}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Hedef Bölüm:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {userProfile?.hedefBolum || "Belirtilmedi"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
