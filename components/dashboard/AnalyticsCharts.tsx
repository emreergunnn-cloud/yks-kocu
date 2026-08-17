"use client";

import { TrendLineChart } from "../analytics/TrendLineChart";
import { SectionBarChart } from "../analytics/SectionBarChart";
import { Card } from "../ui/Card";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface Props {
  loading: boolean;
  trendData: any[];
  sectionAverages: any[];
  targetTytNet?: number;
  targetAytNet?: number;
  currentTytNet: number;
  currentAytNet: number;
}

function progress(current: number, target?: number) {
  if (!target || target <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((current / target) * 100)
  );
}

interface TargetRowProps {
  label: string;
  current: number;
  target?: number;
  max: number;
  barClassName: string;
}

function TargetRow({
  label,
  current,
  target,
  max,
  barClassName,
}: TargetRowProps) {
  const percentage = progress(current, target);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {label}
          </p>

          <p className="text-xs text-slate-500">
            Mevcut: {current.toFixed(1)} / {max}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">
            Hedef
          </p>

          <p className="text-lg font-black text-slate-900 dark:text-white">
            {target && target > 0
              ? `${target} Net`
              : "Belirlenmedi"}
          </p>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${barClassName}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {target && target > 0 && (
        <p className="text-right text-[11px] font-medium text-slate-400">
          %{percentage}
        </p>
      )}
    </div>
  );
}

export function AnalyticsCharts({
  loading,
  trendData,
  sectionAverages,
  targetTytNet,
  targetAytNet,
  currentTytNet,
  currentAytNet,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                TYT & AYT Net Gelişim Trendi
              </h3>

              <p className="text-xs text-slate-500">
                TYT ve AYT net gelişiminizi ayrı ayrı takip edin
              </p>
            </div>

            <a
              href="/analytics"
              className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
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

        <Card className="space-y-5">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hedef Sıralama Ulaşımı
            </h3>

            <p className="text-xs text-slate-500">
              TYT ve AYT hedef netlerinize ayrı ilerleme
            </p>
          </div>

          <TargetRow
            label="TYT"
            current={currentTytNet}
            target={targetTytNet}
            max={120}
            barClassName="bg-blue-600"
          />

          <TargetRow
            label="AYT"
            current={currentAytNet}
            target={targetAytNet}
            max={80}
            barClassName="bg-indigo-600"
          />
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
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
