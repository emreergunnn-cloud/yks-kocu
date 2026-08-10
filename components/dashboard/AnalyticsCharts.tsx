"use client";

import { TrendLineChart } from "../analytics/TrendLineChart";
import { SectionBarChart } from "../analytics/SectionBarChart";
import { ProgressDonut } from "../analytics/ProgressDonut";
import { Card } from "../ui/Card";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface Props {
  loading: boolean;
  trendData: any[];
  sectionAverages: any[];
  targetProgressPercentage: number;
  estimatedTargetNet: number;
  maxTytNet: number;
  maxAytNet: number;
}

export function AnalyticsCharts({
  loading,
  trendData,
  sectionAverages,
  targetProgressPercentage,
  estimatedTargetNet,
  maxTytNet,
  maxAytNet,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                TYT & AYT Net Gelişim Trendi
              </h3>

              <p className="text-xs text-slate-500">
                Zaman içindeki deneme netlerinizin değişimi
              </p>
            </div>

            <a
              href="/analytics"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Detaylı Analiz →
            </a>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <TrendLineChart data={trendData} />
          )}
        </Card>

        <Card className="space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hedef Sıralama Ulaşımı
            </h3>

            <p className="text-xs text-slate-500">
              Tahmini gerekli toplam net seviyesi
            </p>
          </div>

          <div className="py-4">
            <ProgressDonut
              percentage={targetProgressPercentage}
              label={`Hedef: ~${estimatedTargetNet} Net`}
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl text-xs space-y-1">
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">
                En Yüksek Toplam Net:
              </span>

              <span className="font-bold text-slate-900 dark:text-white">
                {maxTytNet + maxAytNet} Net
              </span>
            </div>

            <div className="flex justify-between font-medium">
              <span className="text-slate-500">
                Tahmini Hedef Net:
              </span>

              <span className="font-bold text-blue-600">
                {estimatedTargetNet} Net
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Bölüm Bazlı Net Ortalamaları
          </h3>

          <p className="text-xs text-slate-500">
            Güçlü ve geliştirilmesi gereken dersleriniz
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <SectionBarChart data={sectionAverages} />
        )}
      </Card>
    </div>
  );
}